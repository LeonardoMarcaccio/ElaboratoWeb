let friendCount = 3;
userList = new Array();
elem = document.getElementById("page-chat");
chatCache = null;

for (let i=0; i<friendCount; i++) {
    let tmp = document.createElement("button");
    tmp.textContent = "User-" + (i+1).toString();
    tmp.id = "user-" + (i+1).toString();
    elem.appendChild(tmp);
    userList.push(tmp);
    tmp.onclick = (btn) => {
        chatCache = userList[i];
        let evt = new CustomEvent(userList[i].id, {detail: btn.currentTarget});
        document.dispatchEvent(evt);
    }
    document.addEventListener(tmp.id, async (evt) => {
        mainPageLoader.flushPage();
        chatPageLoader.loadPage("messages");
    });
}

let chatPageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage, mainGlobalVariables.page.mainContentPage.childElementCount);