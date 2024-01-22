let assetPrototypes = new Map();
let headerEnd;
let pageElementCount;

const mainConstants = {
    actionBar: {
        HOME: "home",
        SEARCH: "search",
        POST: "post",
        CHAT: "chat",
        PROFILE: "profile"
    }
}

let mainGlobalVariables = {
    page: {
        header: null,
        mainContentPage: null,
        footer: null
    },
    dynamicElements: {
        loadingBanner: null
    },
    buttonData: {
        lastSelection: null
    }
}

async function simpleAdd(src, add) {
    let obtainedAsset = await AssetManager.loadAsset(add);
    DOMUtilities.addChildElementToNode(src, obtainedAsset);
}

function flushMainContentPage() {
    DOMUtilities.removeChildElementsToNode(mainGlobalVariables.page.mainContentPage, 0);
}

async function selectPage(selector) {
    let functionSelection;
    flushMainContentPage();
    if (mainGlobalVariables.lastSelection != null) {
        document.getElementById("footer-" + mainGlobalVariables.lastSelection).disabled = false;
    }
    document.getElementById("footer-" + selector).disabled = true;
    mainGlobalVariables.lastSelection = selector;

    /*
    SWITCH REPLACEMENT
    simpleAdd(mainGlobalVariables.page.mainContentPage, selector + ".html");
    */

    switch(selector) {
        case mainConstants.actionBar.HOME:

        break;
        case mainConstants.actionBar.SEARCH:

        break;
        case mainConstants.actionBar.POST:

        break;
        case mainConstants.actionBar.CHAT:

        break;
        case mainConstants.actionBar.PROFILE:
            simpleAdd(mainGlobalVariables.page.mainContentPage, "profile.html");
        break;
        default:
            throw new Error("Action "+selector+" not supported!");
    }
}

async function mainPageInit() {

    simpleAdd(document.body, "header.html");
    headerEnd = document.body.childElementCount;
    
    let initialAssetArr = ["footer.html"];
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

    categories = [mainConstants.actionBar.HOME,
            mainConstants.actionBar.SEARCH,
            mainConstants.actionBar.POST,
            mainConstants.actionBar.CHAT,
            mainConstants.actionBar.PROFILE];

    for (let name in categories) {
        document.getElementById("footer-" + categories[name]).onclick = function () {
            selectPage(categories[name]);
        };
    }

    pageElementCount = document.body.childElementCount;
}

document.body.onload = () => {
    mainPageInit();
}
