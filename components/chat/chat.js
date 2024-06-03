let sharedChatCache = null;

class ChatPage extends DynamicPage {
  constructor() {
    super();
    this.pageId = events.actionBar.chat;
  }

  async load() {
    if (!mainGlobalVariables.userData.userLoggedIn) {
      return;
    }
    if (mainGlobalVariables.buttonData.lastSelection != "chat") {
      mainGlobalVariables.buttonData.lastSelection = "chat";
      history.pushState({location: events.actionBar.chat}, null, "chat");
    }
    await super.load("/chat/chat");
    mainGlobalVariables.page.currentPageLoc = this.pageId;

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
    this.friendCount = this.bois != undefined ? this.bois.length : 0;
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

    let incFriends = document.createElement("p");
    let newOnes = await APICalls.getRequests.getIncomingFriends(this.self.username);
    newOnes = newOnes.response;
    this.elem.appendChild(incFriends);
    if (newOnes == undefined) {
      incFriends.innerText = "You have no incoming friend requests";
    } else {
      incFriends.innerText = "You have " + newOnes.length + " incoming friend requests";
      for (let i=0; i<newOnes.length; i++) {
        let container = document.createElement("div");
        let buttons = document.createElement("div");
        let accept = document.createElement("button");
        let deny = document.createElement("button");
        let tmp = document.createElement("p");
        tmp.textContent = newOnes[i].username;
        tmp.id = "user-" + (i+1).toString();
        accept.textContent = "Accept";
        deny.textContent = "Deny";
        container.style.display = "inline-flex";
        container.style.justifyContent = "space-evenly";
        buttons.appendChild(accept);
        buttons.appendChild(deny);
        container.appendChild(tmp);
        container.appendChild(buttons);
        this.elem.appendChild(container);

        accept.onclick = async () => {
          await APICalls.postRequests.updateFriendStatus(newOnes[i].username, true);
          this.elem.removeChild(container);
        }

        deny.onclick = async () => {
          await APICalls.postRequests.updateFriendStatus(newOnes[i].username, false);
          this.elem.removeChild(container);
        }
      }
    }
  }
}

let chatClass = new ChatPage();

document.addEventListener(events.actionBar.chat, () => {
  chatClass.load();
});