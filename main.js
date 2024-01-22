let assetPrototypes = new Map();
let childAmount;

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

function flushMainContentPage() {
    
}

async function selectPage(selector) {
    let functionSelection;
    DOMUtilities.removeChildElementsToNode(document.body, childAmount);
    if (mainGlobalVariables.lastSelection != null) {
        document.getElementById("footer-" + mainGlobalVariables.lastSelection).disabled = false;
    }
    document.getElementById("footer-" + selector).disabled = true;
    mainGlobalVariables.lastSelection = selector;
    let obtainedAsset;

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
            obtainedAsset = await AssetManager.loadAsset("profile.html");
            DOMUtilities.addChildElementToNode(document.body, obtainedAsset);
        break;
        default:
            throw new Error("Action "+selector+" not supported!");
    }
}

async function mainPageInit() {
    let initialAssetArr = ["header.html", "footer.html"];
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

    childAmount = document.body.childElementCount;
}

document.body.onload = () => {
    mainPageInit();
}
