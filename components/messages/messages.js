let messageCount = 5;
IDList = new Array();
chat = document.getElementById("page-dm-upper");
let user = document.createElement("textarea");
user.textContent = chatCache.textContent;
user.disabled = true;
user.style.alignSelf = "center";
chat.appendChild(user);

for (let i=0; i<messageCount; i++) {
    let tmp = document.createElement("textarea");
    tmp.textContent = "Test-" + (i+1).toString();
    tmp.disabled = true;
    tmp.className = i%2 == 0 ? "message-sent" : "message-received";
    chat.appendChild(tmp);
}

document.body.insertBefore(document.getElementById("page-dm-lower"), mainGlobalVariables.page.footer);