let chatLoader = new ContentLoader(() => {});
let chatCache = null;
let messagePage = null;
let bois = null;
let friendCount = 0;
let userList = null;
let elem = null;

function loadChatList() {
    mainPageLoader.flushPage();
    bois = APICalls.getRequests.getFriendList(/* self */);
    friendCount = bois.length;
    userList = new Array();
    elem = document.getElementById("page-chat");
    
    for (let i=0; i<friendCount; i++) {
        let tmp = document.createElement("button");
        tmp.textContent = bois[i].username;
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
}

document.getElementById("nav-chat").onclick = () => loadChatList();
loadChatList();