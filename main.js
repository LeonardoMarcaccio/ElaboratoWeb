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
  }
}

function registerMainEvents() {
  console.debug("Registering main events");
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

function loadpageStructure() {
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

async function mainPageInit() {
  let fetchPromise = fetchMainPageComponents();
  registerMainEvents();
  loadpageStructure();
  let promiseResult = await fetchPromise;
  if (promiseResult instanceof Error) {
    console.error(promiseResult);
    return;
  }
  fillStructure();
}

document.body.onload = () => {
  mainPageInit();
}
