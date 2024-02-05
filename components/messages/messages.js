let form = document.createElement("form");
let bar = document.createElement("textarea");
let send = document.createElement("input");
bar.placeholder = "Message";
send.value = "Send";
send.type = "button";
form.appendChild(bar);
form.appendChild(send);

function loadChat() {
    let messageCount = 19;
    let chat = document.getElementById("page-dm-upper");
    let user = document.createElement("p");
    user.textContent = chatCache.textContent;
    user.className = "user-title";
    user.id = "user-dm";
    mainGlobalVariables.page.mainContentHeading.appendChild(user);
    
    for (let i=0; i<messageCount; i++) {
        let tmp = document.createElement("p");
        tmp.textContent = "Test-" + (i+1).toString();
        tmp.className = i%2 == 0 ? "message-sent" : "message-received";
        chat.appendChild(tmp);
    }

    mainGlobalVariables.page.mainContentFooting.appendChild(form);
}

chatLoader.updateLoadMethod(loadChat);
chatLoader.loadChat();