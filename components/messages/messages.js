let form = document.createElement("form");
let bar = document.createElement("textarea");
let send = document.createElement("input");
bar.placeholder = "Message";
send.value = "Send";
send.type = "button";
form.appendChild(bar);
form.appendChild(send);

send.onclick = async () => {
    await APICalls.postRequests.sendMessageRequest(target, content);
};

chatLoader.switchLoadMethod(async (page) => {
    let messages = await APICalls.getRequests.getMessages(target, page, 16);
    let messageCount = messages.length;
    let chat = document.getElementById("page-dm-upper");
    let user = document.createElement("p");
    let prev = document.createElement("div");
    user.textContent = chatCache.textContent;
    user.className = "user-title";
    user.id = "user-dm";
    prev.id = "message-bottom";
    mainGlobalVariables.page.mainContentHeading.appendChild(user);

    if (page == 0) {
        chat.appendChild(prev);
    } else {
        chat.insertBefore(prev, chat.firstChild);
    }
    
    for (let i=0; i<messageCount; i++) {
        let tmp = document.createElement("p");
        tmp.textContent = messages[i].content;
        tmp.className = messages[i].sent ? "message-sent" : "message-received";
        chat.insertBefore(tmp, prev);
        prev = tmp;
    }

    chat.removeChild(document.getElementById("message-bottom"));
    mainGlobalVariables.page.mainContentFooting.appendChild(form);
});

chatLoader.loadChat(0);