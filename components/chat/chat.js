class DelayedChatLoader {
    loadMethod = () => {};

    updateLoadMethod(loadMethod = () => {}) {
        this.loadMethod = loadMethod;
    }

    loadChat() {
        this.loadMethod();
    }
}

let chatLoader = new DelayedChatLoader();
let messagePage = null;
let friendCount = 3;
let userList = new Array();
let elem = document.getElementById("page-chat");
let chatCache = null;

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
        let lambdaOperation = null;
        if (messagePage == null) {
            lambdaOperation = async () => {
                messagePage = await AssetManager.loadAsset("messages.html");
                DOMUtilities.addChildElementToNode(mainGlobalVariables.page.mainContentPage, messagePage);
                documentUtilities.addScriptFile("/components/messages/messages.js");
              }
        } else {
            lambdaOperation = async () => {
                DOMUtilities.addChildElementToNode(mainGlobalVariables.page.mainContentPage, messagePage);
              }
        }
        DOMUtilities.removeChildElementsToNode(mainGlobalVariables.page.mainContentHeading, 0);
        DOMUtilities.removeChildElementsToNode(mainGlobalVariables.page.mainContentPage, mainGlobalVariables.page.mainContentPage.childElementCount);
        await lambdaOperation();
        chatLoader.loadChat();
    });
}