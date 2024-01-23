let assetPrototypes = new Map();

const events = {
    actionBar: {
        HOME: "footer-feed",
        SEARCH: "footer-search",
        POST: "footer-post",
        CHAT: "footer-chat",
        PROFILE: "footer-profile"
    },
    genericActions: {
        MAINCONTENTPAGECHANGE: "mainContentPageChange",
    },
}

const mainPageLocChanges= {
    mainLocations: {
        HOME: "feed-page",
        SEARCH: "search-page",
        POST: "post-page",
        CHAT: "chat-page",
        PROFILE: "profile-page",
    },
    userSpecific: {
        REGISTER: "register-page",
        LOGIN: "login-page"
    }
}

let mainGlobalVariables = {
    page: {
        header: null,
        mainContentPage: null,
        footer: null,
        currentPageLoc: null
    },
    dynamicElements: {
        loadingBanner: null
    },
    buttonData: {
        lastSelection: null
    }
}

function flushMainContentPage() {
    DOMUtilities.removeChildElementsToNode(mainGlobalVariables.page.mainContentPage, 0);
}

async function switchView(page) {
    let lambdaOperation = null;
    switch(page) {
        case events.actionBar.HOME:
        lambdaOperation = async () => {
            let obtainedAsset = await AssetManager.loadAsset("home.html");
            DOMUtilities.addChildElementToNode(mainGlobalVariables.page.mainContentPage, obtainedAsset);
            documentUtilities.addScriptFile("/components/home/home.js");
        }
        break;
        case events.actionBar.SEARCH:
            lambdaOperation = async () => {
                let obtainedAsset = await AssetManager.loadAsset("search.html");
                DOMUtilities.addChildElementToNode(mainGlobalVariables.page.mainContentPage, obtainedAsset);
                documentUtilities.addScriptFile("/components/search/search.js");
            }
        break;
        case events.actionBar.POST:
            lambdaOperation = async () => {
                let obtainedAsset = await AssetManager.loadAsset("post.html");
                DOMUtilities.addChildElementToNode(mainGlobalVariables.page.mainContentPage, obtainedAsset);
                documentUtilities.addScriptFile("/components/post/post.js");
            }
        break;
        case events.actionBar.CHAT:
            lambdaOperation = async () => {
                let obtainedAsset = await AssetManager.loadAsset("chat.html");
                DOMUtilities.addChildElementToNode(mainGlobalVariables.page.mainContentPage, obtainedAsset);
                documentUtilities.addScriptFile("/components/chat/chat.js");
            }
        break;
        case events.actionBar.PROFILE:
            lambdaOperation = async () => {
                let obtainedAsset = await AssetManager.loadAsset("profile.html");
                DOMUtilities.addChildElementToNode(mainGlobalVariables.page.mainContentPage, obtainedAsset);
                documentUtilities.addScriptFile("/components/profile/profile.js");
            }
        break;
        default:
            console.error("Unsupported operation: "+page);
            return new Error("Unsupported operation: "+page);
    }
    flushMainContentPage();
    await lambdaOperation();
    let pageChangeEvt = new CustomEvent(events.genericActions.MAINCONTENTPAGECHANGE, {detail: page});
    document.dispatchEvent(pageChangeEvt);
}

function registerActionBarEvents() {
    for(let eventEntry in events.actionBar) {
        let eventValue = events.actionBar[eventEntry];
        document.addEventListener(eventValue, (evt) => {
            switchView(evt.detail.id);
        });
    }
}

async function mainPageInit() {
    registerActionBarEvents();

    let initialAssetArr = ["header.html","footer.html"];
    for(let asset in initialAssetArr) {
        let obtainedAsset = await AssetManager.loadAsset(initialAssetArr[asset]);
        DOMUtilities.addChildElementToNode(document.body, obtainedAsset);
    }

    mainGlobalVariables.page.header = document.getElementsByTagName("header")[0];
    mainGlobalVariables.page.footer = document.getElementsByTagName("footer")[0];
    mainGlobalVariables.page.mainContentPage = document.createElement("div");
    mainGlobalVariables.page.mainContentPage.id = "main-content-page";
    document.body.insertBefore(mainGlobalVariables.page.mainContentPage, mainGlobalVariables.page.footer);
    mainGlobalVariables.dynamicElements.loadingBanner = document.getElementById("loading-banner");
    mainGlobalVariables.dynamicElements.loadingBanner.style.display = "none";

    documentUtilities.addScriptFile("./components/footer/footer.js");
}

document.body.onload = () => {
    mainPageInit();
}
