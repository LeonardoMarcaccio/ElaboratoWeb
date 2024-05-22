class MessagePage extends DynamicPage {
    async load() {
        await super.load("/messages/messages");

        this.chatLoader = new ContentLoader(() => {});
        this.chatCache = sharedChatCache;
        await this.pageSetup();
        this.chatLoader.loadMore();
    }

    async pageSetup() {
        let form = document.createElement("form");
        let bar = document.createElement("textarea");
        let send = document.createElement("input");
        bar.placeholder = "Message";
        send.value = "Send";
        send.type = "button";
        form.appendChild(bar);
        form.appendChild(send);

        send.onclick = async () => {
            await APICalls.postRequests.sendMessageRequest(this.chatCache.textContent, bar.textContent);
        };

        this.chatLoader.switchLoadMethod(async (page) => {
            let username = await APICalls.getRequests.getUserInfo();
            username = username.response.Username;
            let messages = await APICalls.getRequests.getMessagesRequest(this.chatCache.textContent, page, 16);
            messages = messages.response;
            let messageCount = messages.length;
            let chat = document.createElement("div");
            let user = document.createElement("p");
            let prev = document.createElement("div");
            chat.id = "page-dm-upper";
            user.textContent = this.chatCache.textContent;
            user.className = "user-title";
            user.id = "user-dm";
            prev.id = "message-bottom";
            mainHandler.contentHandling.setHeadingContent(user);
            
            if (page == 1) {
                    chat.appendChild(prev);
                } else {
                    chat.insertBefore(prev, chat.firstChild);
                }
                
                for (let i=0; i<messageCount; i++) {
                    let tmp = document.createElement("p");
                    tmp.textContent = messages[i].Text;
                    tmp.className = messages[i].Username == username ? "message-sent" : "message-received";
                    chat.insertBefore(tmp, prev);
                    prev = tmp;
                }
                mainHandler.contentHandling.setBodyContent(chat);
                mainHandler.contentHandling.setFootingContent(form);
        });
    }
}

let messageClass = new MessagePage();

document.addEventListener("message-page", () => {
    mainHandler.contentHandling.purgePageContent();
    messageClass.load();
});