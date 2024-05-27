let sharedChatCache = null;

class ChatPage extends DynamicPage {
  async load() {
    if (!mainGlobalVariables.userData.userLoggedIn) {
      return;
    }
    if (mainGlobalVariables.buttonData.lastSelection != "chat") {
      mainGlobalVariables.buttonData.lastSelection = "chat";
      history.pushState({location: events.actionBar.chat}, null, "chat");
    }
    await super.load("/chat/chat");

    this.messagePage = null;
    this.bois = null;
    this.friendCount = 0;
    this.userList = null;
    this.elem = null;
    this.self = null;
    await this.loadChatList();
  }

  getChatPage() {
    return this.lazyNodeIdQuery("page-chat", true);
  }

  getNavChat() {
    return this.lazyNodeIdQuery("nav-chat");
  }

  async triggerMessageContent() {
    mainHandler.contentHandling.clearBodyContent();
    mainHandler.contentHandling.clearHeadingContent();
    let event = new CustomEvent("message-page");
    document.dispatchEvent(event);
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
        sharedChatCache = this.userList[i];
        let evt = new CustomEvent(this.userList[i].id, {detail: btn.currentTarget});
        document.dispatchEvent(evt);
      }
      
      document.addEventListener(tmp.id, this.triggerMessageContent);
    }

    this.elem.style.maxHeight = (this.friendCount * 50) + 20 + "px";
  }
}

let chatClass = new ChatPage();

document.addEventListener(events.actionBar.chat, () => {
  chatClass.load();
});