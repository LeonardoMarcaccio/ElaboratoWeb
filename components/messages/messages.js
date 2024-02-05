function loadChat() {
    let messageCount = 19;
    let chat = document.getElementById("page-dm-upper");
    let user = document.createElement("textarea");
    user.textContent = chatCache.textContent;
    user.disabled = true;
    user.className = "user-title";
    user.id = "user-dm";
    mainGlobalVariables.page.mainContentPage.parentNode.insertBefore(user, mainGlobalVariables.page.mainContentPage);
    
    for (let i=0; i<messageCount; i++) {
        let tmp = document.createElement("textarea");
        tmp.textContent = "Test-" + (i+1).toString();
        tmp.disabled = true;
        tmp.className = i%2 == 0 ? "message-sent" : "message-received";
        chat.appendChild(tmp);
    }
}

chatLoader.updateLoadMethod(loadChat);
chatLoader.loadChat();