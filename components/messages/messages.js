class MessagePage extends DynamicPage {
    constructor() {
        super();
        this.pageId = events.subPages.messages;
    }

    async load() {
        await super.load("/messages/messages");
        mainGlobalVariables.page.currentPageLoc = this.pageId;

        this.chatLoader = new ContentLoader(() => {});
        this.chatCache = sharedChatCache;
        this.messagesDiv = null;
        this.chat = null;
        await this.pageSetup();
        this.chatLoader.loadMore();
    }

    getMessagesDiv() {
        return this.lazyNodeIdQuery("messages-div", true);
    }

    async pageSetup() {
        this.messagesDiv = this.getMessagesDiv();
        let form = document.createElement("form");
        let label = document.createElement("label");
        let bar = document.createElement("input");
        let send = document.createElement("button");
        form.className = "messages-form";
        bar.id = "message-bar-input";
        bar.type = "text";
        bar.placeholder = "Message...";
        label.style.display = "none";
        label.textContent = "Message";
        label.htmlFor = "message-bar-input";
        send.innerText = "Send";
        send.type = "submit";
        send.name = "send-message";
        form.appendChild(label);
        form.appendChild(bar);
        form.appendChild(send);

        form.onsubmit = async (event) => {
            event.preventDefault();
            await APICalls.postRequests.sendMessageRequest(this.chatCache.textContent, JSONBuilder.build(["message"],[bar.value]));
            let tmp = document.createElement("div");
            let text = document.createElement("p");
            text.textContent = bar.value;
            tmp.className = "message-sent";
            tmp.appendChild(text);
            this.chat.appendChild(tmp);
        };

        this.chatLoader.switchLoadMethod(async (page) => {
            let username = await APICalls.getRequests.getUserInfo();
            username = username.response.username;
            let user = document.createElement("h1");
            let prev = document.createElement("div");
            this.chat = document.createElement("div");
            this.chat.id = "page-dm-upper";
            user.textContent = this.chatCache.textContent;
            user.className = "user-title";
            user.id = "user-dm";
            prev.id = "message-bottom";
            mainGlobalVariables.page.mainContentHeading.addContent(user);
            let messages = await APICalls.getRequests.getMessagesRequest(this.chatCache.textContent, page, 16);
            messages = messages.response;
            let messageCount = messages != undefined ? messages.length : 0;
            
            if (page == 1) {
                this.chat.appendChild(prev);
            } else {
                this.chat.insertBefore(prev, chat.firstChild);
            }
                
            for (let i=0; i<messageCount; i++) {
                let tmp = document.createElement("div");
                let text = document.createElement("p");
                text.textContent = messages[i].Text;
                tmp.className = messages[i].Username == username ? "message-sent" : "message-received";
                tmp.appendChild(text);
                this.chat.insertBefore(tmp, prev);
                prev = tmp;
            }
            this.messagesDiv.appendChild(this.chat);
            mainGlobalVariables.page.mainContentFooting.addContent(form);
        });
    }
}

let messageClass = new MessagePage();

document.addEventListener("message-page", () => {
    messageClass.load();
});