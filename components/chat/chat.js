let chatLoader = new ContentLoader(() => {});
let chatCache = null;
let messagePage = null;
let bois = null;
let friendCount = 0;
let userList = null;
let elem = null;

function loadChatList() {
    /*
    self = APICalls.getRequests.getUserInfo();
    self = self.username;
    bois = APICalls.getRequests.getFriendList(self);
    */
    bois = [{"username":"TestUser2",
            "email":"TestUserEmail2@mail.com",
            "password":null,
            "firstname":"Jane",
            "lastname":"Smith",
            "gender":"Female",
            "biography":"Lorem ipsum",
            "personalwebsite":"https:\/\/www.Fakesite2.com\/",
            "pfp":"http:\/\/localhost\/media\/users\/placeholder.webp",
            "phonenumber":"0000000002"}];
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
            mainHandler.contentHandling.clearBodyContent();
            let lambdaOperation = null;
            if (messagePage == null) {
                lambdaOperation = async () => {
                    messagePage = await loader.loadAsset("messages/messages", {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
                    messagePage = new ElementHandler(await messagePage[0].text()).getContent();
                    mainHandler.contentHandling.setBodyContent(messagePage);
                }
            } else {
                lambdaOperation = async () => {
                    mainHandler.contentHandling.setBodyContent(messagePage);
                }
            }
            mainHandler.contentHandling.clearHeadingContent();
            await lambdaOperation();
            chatLoader.loadMore();
        });
    }
}

document.getElementById("nav-chat").onclick = () => loadChatList();
loadChatList();