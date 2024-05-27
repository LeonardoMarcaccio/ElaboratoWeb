class MessagePage extends DynamicPage {
    async load() {
        await super.load("/messages/messages");

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
        let bar = document.createElement("input");
        let send = document.createElement("button");
        form.className = "messages-form";
        bar.type = "text";
        bar.placeholder = "Message...";
        send.innerText = "Send";
        send.type = "submit";
        form.appendChild(bar);
        form.appendChild(send);

        form.onsubmit = async (event) => {
            event.preventDefault();
            await APICalls.postRequests.sendMessageRequest(this.chatCache.textContent, bar.value);
            let tmp = document.createElement("p");
            tmp.textContent = bar.value;
            tmp.className = "message-sent";
            this.chat.appendChild(tmp);
        };

        this.chatLoader.switchLoadMethod(async (page) => {
            let username = await APICalls.getRequests.getUserInfo();
            username = username.response.username;
            let messages = await APICalls.getRequests.getMessagesRequest(this.chatCache.textContent, page, 16);
            messages = messages.response;
            let messageCount = messages.length;
            let user = document.createElement("p");
            let prev = document.createElement("div");
            this.chat = document.createElement("div");
            this.chat.id = "page-dm-upper";
            user.textContent = this.chatCache.textContent;
            user.className = "user-title";
            user.id = "user-dm";
            prev.id = "message-bottom";
            mainGlobalVariables.page.mainContentHeading.addContent(user);
            
            if (page == 1) {
                    this.chat.appendChild(prev);
                } else {
                    this.chat.insertBefore(prev, chat.firstChild);
                }
                
                for (let i=0; i<messageCount; i++) {
                    let tmp = document.createElement("p");
                    tmp.textContent = messages[i].Text;
                    tmp.className = messages[i].Username == username ? "message-sent" : "message-received";
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