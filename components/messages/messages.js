function loadChat() {
    let messageCount = 19;
    let chat = document.getElementById("page-dm-upper");
    let navbar = document.getElementById("navbar-illustration");
    let user = document.createElement("textarea");
    user.textContent = chatCache.textContent;
    user.disabled = true;
    user.className = "user-title";
    user.id = "user-dm";
    navbar.appendChild(user);
    document.body.insertBefore(document.getElementById("page-dm-lower"), mainGlobalVariables.page.footer);
    
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