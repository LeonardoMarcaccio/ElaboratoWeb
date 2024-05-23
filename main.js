let assetPrototypes = new Map();

/**
 * A container for predefined specific events that can happen while browsing the page.
 */
const events = {
  /**
   * Events that are usually fired by the nav bar.
   */
  actionBar: {
    home: "feed-page",
    search: "search-page",
    post: "post-page",
    chat: "chat-page",
    profile: "profile-page",
  },
  /**
   * Events that are fired by user-account related events.
   */
  userSpecific: {
    /**
     * When the registration form is triggered
     */
    register: "register-page",
    /**
     * When the login form is triggered.
     */
    login: "login-page"
  },
  /**
   * Generic events.
   */
  genericActions: {
    /**
     * Fired whenever the main content page changes.
     */
    pagechange: "page-change",
  },
  /**
   * Events regarding communication with the backend.
   */
  apiActions: {
    /**
     * User successfully authenticated.
     */
    authSuccess: "api-authentication-success",
    /**
     * User provided bad authentication data/is trying to access login locked content.
     */
    authFailure: "api-authentication-failure",
  }
}


let mainGlobalVariables = {
  page: {
    body: null,
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
  },
  userData: {
    userLoggedIn: false
  }
}

const mainHandler = {
  contentHandling: {
    getFootingContent: () => {
      return mainGlobalVariables.page.mainContentFooting;
    },
    getHeadingContent: () => {
      return mainGlobalVariables.page.mainContentHeading;
    },
    getBodyContent: () => {
      return mainGlobalVariables.page.mainContentPage;
    },
    setHeadingContent: (content) => {
      mainHandler.contentHandling.clearHeadingContent();
      mainGlobalVariables.page.mainContentHeading.addContent(content);
    },
    setBodyContent: (content) => {
      mainHandler.contentHandling.clearBodyContent();
      mainGlobalVariables.page.mainContentPage.addContent(content);
    },
    setFootingContent: (content) => {
      mainHandler.contentHandling.clearFootingContent();
      mainGlobalVariables.page.mainContentFooting.addContent(content);
    },
    clearHeadingContent: () => {
      mainGlobalVariables.page.mainContentHeading.clearContent();
    },
    clearBodyContent: () => {
      mainGlobalVariables.page.mainContentPage.clearContent();
    },
    clearFootingContent: () => {
      mainGlobalVariables.page.mainContentFooting.clearContent();
    },
    purgePageContent: () => {
      mainHandler.contentHandling.clearHeadingContent();
      mainHandler.contentHandling.clearBodyContent();
      mainHandler.contentHandling.clearFootingContent();
    },
    simplePageSwitch: (heading = null, body = null, footing = null) => {
      if (heading == null) {
        mainHandler.contentHandling.clearHeadingContent();
      } else {
        mainHandler.contentHandling.setHeadingContent(heading);
      }
      if (body == null) {
        mainHandler.contentHandling.clearBodyContent();
      } else {
        mainHandler.contentHandling.setHeadingContent(body);
      }
      if (footing == null) {
        mainHandler.contentHandling.clearFootingContent();
      } else {
        mainHandler.contentHandling.setHeadingContent(footing);
      }
    }
  }
}

function enableMainLoadingBanner(enable) {
  if (enable) {
    mainGlobalVariables.dynamicElements.loadingBanner.style.display = "flex";
  } else {
    mainGlobalVariables.dynamicElements.loadingBanner.style.display = "none";
  }
}

function fetchMainPageComponents() {
  return new Promise(async (success, failure) => {
    let loader = new AssetLoader("/components/");
    try {
      let nav = await loader.loadAsset("/nav/nav", {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
      let footer = await loader.loadAsset("/footer/footer", {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
      mainGlobalVariables.page.nav = new ElementHandler(await nav[0].text());
      mainGlobalVariables.page.footer = new ElementHandler(await footer[0].text());
      success();
    } catch (error) {
      failure(error);
    }
  });
}

function fetchScriptComponents() {
  return new Promise(async (success, failure) => {
    let baseFolder = "/components/";
    try {
      let scriptPaths = [
        baseFolder + "login/login.js",
        baseFolder + "registration/registration.js",
        baseFolder + "chat/chat.js",
        baseFolder + "search/search.js",
        baseFolder + "messages/messages.js",
        baseFolder + "profile/profile.js",
        baseFolder + "post/post.js",
        baseFolder + "feed/feed.js",
        //baseFolder + "cookiebanner/cookiebanner.js",
        baseFolder + "settings/settings.js"];
      let scriptPromises = Array();
      for (let scriptPathIndex in scriptPaths) {
        scriptPromises.push(DOMUtilities.addScript(document.body, scriptPaths[scriptPathIndex]));
      }
      for (let scriptPromiseIndex in scriptPromises) {
        await scriptPromises[scriptPromiseIndex];
      }
      success();
    } catch (error) {
      failure(error);
    }
  });
}

function loadpageStructure() {
  // Essential base elements assignment
  mainGlobalVariables.dynamicElements.loadingBanner = document.getElementById("loading-banner");
  mainGlobalVariables.page.body = new ElementHandler(document.body);

  // Main content page generation
  mainGlobalVariables.page.mainContentPage = new ElementHandler(document.createElement("div"));
  mainGlobalVariables.page.mainContentPage.getContent().id = "main-content-page";
  // Main content heading generation
  mainGlobalVariables.page.mainContentHeading = new ElementHandler(document.createElement("div"));
  mainGlobalVariables.page.mainContentHeading.getContent().id = "main-content-heading";
  // Main content footing generation
  mainGlobalVariables.page.mainContentFooting = new ElementHandler(document.createElement("div"));
  mainGlobalVariables.page.mainContentFooting.getContent().id = "main-content-footing";
  // Main content holder generation
  mainGlobalVariables.page.contentHolder = new ElementHandler(document.createElement("div"));
  mainGlobalVariables.page.contentHolder.getContent().id = "content-holder";
  // Main content shaper generation
  mainGlobalVariables.page.contentShaper = new ElementHandler(document.createElement("div"));
  mainGlobalVariables.page.contentShaper.getContent().id = "content-shaper";

  // Attaching components to main content holder
  mainGlobalVariables.page.contentHolder.addContent([mainGlobalVariables.page.mainContentHeading.getContent(),
    mainGlobalVariables.page.mainContentPage.getContent(), mainGlobalVariables.page.mainContentFooting.getContent()]);
  // Attaching content holder to content shaper
  mainGlobalVariables.page.contentShaper.addContent(mainGlobalVariables.page.contentHolder.getContent());
  // Attaching content shaper to body
  mainGlobalVariables.page.body.addContent(mainGlobalVariables.page.contentShaper.getContent());
}

function fillStructure() {
  mainGlobalVariables.page.contentShaper.addContent(mainGlobalVariables.page.nav.getContent());
}

function updateLoginStatus() {
  mainGlobalVariables.userData.userLoggedIn = !(cookieUtilities.readCookie("token") == "");
  if (!mainGlobalVariables.userData.userLoggedIn) {
    let unauthorizedEvt = new CustomEvent(events.apiActions.authFailure);
    document.dispatchEvent(unauthorizedEvt);
  } else {
    let autorizedEvt = new CustomEvent(events.apiActions.authSuccess);
    document.dispatchEvent(autorizedEvt);
  }
}

async function mainPageInit() {
  let mainPageFetchPromise = fetchMainPageComponents();
  let scriptFetchPromise = fetchScriptComponents();
  loadpageStructure();
  let mainPagePromiseResult = await mainPageFetchPromise;
  let scriptPromiseResult = await scriptFetchPromise;
  if (mainPagePromiseResult instanceof Error) {
    console.error(mainPagePromiseResult);
    return;
  }
  if (scriptPromiseResult instanceof Error) {
    console.error(scriptPromiseResult);
    return;
  }
  fillStructure();
  updateLoginStatus();
  enableMainLoadingBanner(false);
}

document.body.onload = () => {
  mainPageInit();
}
