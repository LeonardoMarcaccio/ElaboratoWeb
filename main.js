let assetPrototypes = new Map();

const mainConstants = {
    actionBar: {
        HOME: "feed",
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
        lastSelection: null,
        selector:null
    }
}

function flushMainContentPage() {
    DOMUtilities.removeChildElementsToNode(mainGlobalVariables.page.mainContentPage, 0);
}

async function selectPage(selector) {
    mainGlobalVariables.selector = selector;
    documentUtilities.addScriptFile("./components/footer/footer.js", () => {});
}

async function mainPageInit() {
    
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
