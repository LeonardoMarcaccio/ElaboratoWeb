class ChatPage extends DynamicPage {
  async load() {
    await super.load("/chat/chat");

    this.chatLoader = new ContentLoader(() => {});
    this.chatCache = null;
    this.messagePage = null;
    this.bois = null;
    this.friendCount = 0;
    this.userList = null;
    this.elem = null;
    this.self = null;
    await this.loadChatList();

    this.bindListeners();
  }

  getChatPage() {
    return this.lazyNodeIdQuery("page-chat");
  }

  getNavChat() {
    return this.lazyNodeIdQuery("nav-chat");
  }

  async loadChatList() {
    this.self = await APICalls.getRequests.getUserInfo();
    this.self = this.self.response;
    this.bois = await APICalls.getRequests.getFriendList(this.self.username);
    this.bois = this.bois.response;
    this.friendCount = this.bois.length;
    this.userList = new Array();
    this.elem = this.elem == null ? this.getChatPage() : this.elem;
    while (this.elem.hasChildNodes()) {
      this.elem.removeChild(this.elem.lastChild);
    }

    mainGlobalVariables.page.mainContentPage.addContent(this.elem);
  
    for (let i=0; i<this.friendCount; i++) {
      let tmp = document.createElement("button");
      tmp.textContent = this.bois[i].username;
      tmp.id = "user-" + (i+1).toString();
      this.elem.appendChild(tmp);
      this.userList.push(tmp);
      tmp.onclick = (btn) => {
        this.chatCache = this.userList[i];
        let evt = new CustomEvent(this.userList[i].id, {detail: btn.currentTarget});
        document.dispatchEvent(evt);
      }
      document.addEventListener(tmp.id, async (evt) => {
        mainHandler.contentHandling.clearBodyContent();
        let lambdaOperation = null;
        if (this.messagePage == null) {
          lambdaOperation = async () => {
            this.messagePage = await loader.loadAsset("messages/messages", {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
            this.messagePage = new ElementHandler(await this.messagePage[0].text()).getContent();
            mainHandler.contentHandling.setBodyContent(this.messagePage);
          }
        } else {
          lambdaOperation = async () => {
            mainHandler.contentHandling.setBodyContent(this.messagePage);
          }
        }
        mainHandler.contentHandling.clearHeadingContent();
          await lambdaOperation();
          this.chatLoader.loadMore();
      });
    }
  }

  bindListeners() {
    
  }
}

let chatClass = new ChatPage();

document.addEventListener(events.actionBar.chat, () => {
  mainHandler.contentHandling.purgePageContent();
  chatClass.load();
});