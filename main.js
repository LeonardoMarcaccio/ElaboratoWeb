let assetPrototypes = new Map();
let mainPageLoader = new PageLoader(0);

const events = {
  actionBar: {
    HOME: "feed",
    SEARCH: "search",
    POST: "post",
    CHAT: "chat",
    PROFILE: "profile"
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
  return DOMUtilities.removeChildElementsToNode(mainGlobalVariables.page.mainContentPage, 0);
}

async function switchView(page) {
  mainPageLoader.loadPage(page, mainGlobalVariables.page.mainContentPage);
  let pageChangeEvt = new CustomEvent(events.genericActions.MAINCONTENTPAGECHANGE, {detail: ("footer-" + page)});
  document.dispatchEvent(pageChangeEvt);
}

function registerActionBarEvents() {
  for(let eventEntry in events.actionBar) {
    let eventValue = events.actionBar[eventEntry];
    document.addEventListener("footer-" + eventValue, (evt) => {
      switchView(eventValue);
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
