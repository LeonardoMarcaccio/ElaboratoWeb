let assetPrototypes = new Map();

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
    nav: null,
    footer: null,
    contentShaper: null,
    contentHolder: null,
    currentPageLoc: null
  },
  dynamicElements: {
    loadingBanner: null
  },
  buttonData: {
    lastSelection: null
  }
}

async function mainPageInit() {
  let header = await AssetManager.loadAsset("header.html");
  DOMUtilities.addChildElementToNode(document.body, header);
  
  
  // Content shaper generation
  mainGlobalVariables.page.contentShaper = document.createElement("div");
  mainGlobalVariables.page.contentShaper.id = "content-shaper";
  document.body.appendChild(mainGlobalVariables.page.contentShaper);
  
  let initialAssetArr = ["footer.html", "nav.html"];
  for(let asset in initialAssetArr) {
    let obtainedAsset = await AssetManager.loadAsset(initialAssetArr[asset]);
    DOMUtilities.addChildElementToNode(mainGlobalVariables.page.contentShaper, obtainedAsset);
  }
  mainGlobalVariables.page.header = document.getElementsByTagName("header")[0];
  mainGlobalVariables.page.footer = document.getElementsByTagName("footer")[0];
  mainGlobalVariables.page.nav = document.getElementsByTagName("nav")[0];
  
  // Main content page generation
  mainGlobalVariables.page.mainContentPage = document.createElement("div");
  mainGlobalVariables.page.mainContentPage.id = "main-content-page";
  
  // Content holder page generation
  mainGlobalVariables.page.contentHolder = document.createElement("div");
  mainGlobalVariables.page.contentHolder.id = "content-holder";
  mainGlobalVariables.page.contentHolder.appendChild(
    mainGlobalVariables.page.mainContentPage);
  mainGlobalVariables.page.contentHolder.appendChild(
    mainGlobalVariables.page.footer);
  
  documentUtilities.addScriptFile("./components/nav/nav.js");
  mainGlobalVariables.page.contentShaper.insertBefore(mainGlobalVariables.page.contentHolder,
    mainGlobalVariables.page.nav);

  mainGlobalVariables.dynamicElements.loadingBanner =
    document.getElementById("loading-banner");
  mainGlobalVariables.dynamicElements.loadingBanner.style.display = "none";
}

document.body.onload = () => {
  mainPageInit();
}