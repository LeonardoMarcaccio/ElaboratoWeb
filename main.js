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
  apiActions: {
    authSuccess: "api-authentication-success",
    authFailure: "api-authentication-failure",
  }
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
    mainContentHeading: null,
    mainContentFooting: null,
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

function registerMainEvents() {
  document.addEventListener(events.apiActions.authSuccess, () => {
    let evtPageLoadB = new PageLoader(mainGlobalVariables.page.mainContentPage);
    new PageLoader(mainGlobalVariables.page.mainContentFooting); //NOSONAR
    new PageLoader(mainGlobalVariables.page.mainContentHeading); //NOSONAR
    evtPageLoadB.loadPage("feed");
  })
}

async function mainPageInit() {
  registerMainEvents();

  let header = await AssetManager.loadAsset("header.html");
  DOMUtilities.addChildElementToNode(document.body, header);
  
  
  // Content shaper generation
  mainGlobalVariables.page.contentShaper = document.createElement("div");
  mainGlobalVariables.page.contentShaper.id = "content-shaper";
  document.body.appendChild(mainGlobalVariables.page.contentShaper);
  
  let initialAssetArr = ["nav.html"];
  for(let asset in initialAssetArr) {
    let obtainedAsset = await AssetManager.loadAsset(initialAssetArr[asset]);
    DOMUtilities.addChildElementToNode(mainGlobalVariables.page.contentShaper, obtainedAsset);
  }
  mainGlobalVariables.page.header = document.getElementsByTagName("header")[0];
  //mainGlobalVariables.page.footer = document.getElementsByTagName("footer")[0];
  mainGlobalVariables.page.nav = document.getElementsByTagName("nav")[0];
  
  // Main content page generation
  mainGlobalVariables.page.mainContentPage = document.createElement("div");
  mainGlobalVariables.page.mainContentPage.id = "main-content-page";
  // Main content heading generation
  mainGlobalVariables.page.mainContentHeading = document.createElement("div");
  mainGlobalVariables.page.mainContentHeading.id = "main-content-heading";
  // Main content footing generation
  mainGlobalVariables.page.mainContentFooting = document.createElement("div");
  mainGlobalVariables.page.mainContentFooting.id = "main-content-footing";

  
  // Content holder page generation
  mainGlobalVariables.page.contentHolder = document.createElement("div");
  mainGlobalVariables.page.contentHolder.id = "content-holder";
  mainGlobalVariables.page.contentHolder.appendChild(
    mainGlobalVariables.page.mainContentHeading);
  mainGlobalVariables.page.contentHolder.appendChild(
    mainGlobalVariables.page.mainContentPage);
  mainGlobalVariables.page.contentHolder.appendChild(
    mainGlobalVariables.page.mainContentFooting);
  
  mainGlobalVariables.page.contentShaper.insertBefore(mainGlobalVariables.page.contentHolder,
    mainGlobalVariables.page.nav);

  mainGlobalVariables.dynamicElements.loadingBanner =
    document.getElementById("loading-banner");
  mainGlobalVariables.dynamicElements.loadingBanner.style.display = "none";

  let loader = new PageLoader(mainGlobalVariables.page.mainContentPage);
  if (cookieUtilities.readCookie('token') == '') {
    loader.loadPage("login");
  } else {
    loader.loadPage("feed");
  }

  let cookieBanner = await AssetManager.loadAsset("cookiebanner.html");
  DOMUtilities.addChildElementToNode(document.body, cookieBanner);
  documentUtilities.addScriptFile("./components/cookiebanner/cookiebanner.js");

  //loader.loadPage("registration");
  cookieUtilities.readCookie("token");

  documentUtilities.addScriptFile("./components/nav/nav.js");
  //documentUtilities.addScriptFile("./components/registration/registration.js");
  
}

document.body.onload = () => {
  mainPageInit();
}
