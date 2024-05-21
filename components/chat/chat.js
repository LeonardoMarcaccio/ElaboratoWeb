class ChatPage extends DynamicPage {
  async load() {
    super.load();
    mainHandler.contentHandling.clearBodyContent();
    if (this.opts.cache && this.cached) {
      mainHandler.contentHandling.purgePageContent();
    }
    
    this.chatLoader = new ContentLoader(() => {});
    this.chatCache = null;
    this.messagePage = null;
    this.bois = null;
    this.friendCount = 0;
    this.userList = null;
    this.elem = null;
    this.self = null;

    this.bindListeners();
  }

  getChatPage() {
    return this.lazyNodeIdQuery("page-chat");
  }

  getNavChat() {
    return this.lazyNodeIdQuery("nav-chat");
  }

  loadChatList() {
    this.self = APICalls.getRequests.getUserInfo();
    this.self = this.self.response.username;
    this.bois = APICalls.getRequests.getFriendList(this.self);
    this.bois = this.bois.response;
    this.friendCount = this.bois.length;
    this.userList = new Array();
    this.elem = this.elem == null ? this.getChatPage() : this.elem;
  
    for (let i=0; i<friendCount; i++) {
      let tmp = document.createElement("button");
      tmp.textContent = bois[i].username;
      tmp.id = "user-" + (i+1).toString();
      this.elem.appendChild(tmp);
      this.userList.push(tmp);
      tmp.onclick = (btn) => {
        chatCache = userList[i];
        let evt = new CustomEvent(userList[i].id, {detail: btn.currentTarget});
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
    this.getNavChat().onclick = () => this.loadChatList();
  }
}