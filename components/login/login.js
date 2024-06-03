class LoginPage extends DynamicPage {
  constructor() {
    super();
    this.pageId = events.userSpecific.login;
    this.ready = false;
  }
  async load() {
    if (mainGlobalVariables.buttonData.lastSelection != "search") {
      mainGlobalVariables.buttonData.lastSelection = "search";
      history.pushState({location: events.userSpecific.login}, null, "login");
    }
    if (this.cached) {
      mainHandler.contentHandling.setBodyContent(this.cachedAsset);
      return;
    }
    await super.load("/login/login");
    this.usernameField = null;
    this.passwordField = null;
    this.loginButton = null;
    this.registerButton = null;

    this.bindListeners();
    this.cachedAsset = Array.prototype.slice.call(mainHandler.contentHandling.getBodyContent().getContent().childNodes);
    this.ready = true;
    mainGlobalVariables.page.currentPageLoc = this.pageId;
  }
  reset() {
    super.reset();
  }
  
  getUsernameField() {
    return this.lazyNodeIdQuery("login-username", true);
  }
  getPasswordField() {
    return this.lazyNodeIdQuery("login-passw", true);
  }
  getLoginButton() {
    return this.lazyNodeIdQuery("login-login", true);
  }
  getRegisterButton() {
    return this.lazyNodeIdQuery("login-goto-register", true);
  }
  getForm() {
    return this.lazyNodeIdQuery("login-form");
  }
  showLoginWarningBox(show) {
    let warningbox = this.lazyNodeIdQuery("login-warningbox");
    if (show) {
      warningbox.style.display = "block"
      warningbox.classList.add("generic-warningbox");
      warningbox.classList.remove("generic-warningbox-hidden");
    } else {
      warningbox.style.display = "none"
      warningbox.classList.add("generic-warningbox-hidden");
      warningbox.classList.remove("generic-warningbox");
    }
  }
  clearCredentials() {
    this.getForm().reset();
  }
  isReady() {
    return this.ready;
  }

  triggerCredentialError(element) {
    element.classList.add("wrong");
  }
  clearCredentialError() {
    this.getUsernameField().classList.remove("wrong");
    this.getPasswordField().classList.remove("wrong");
  }
  bindListeners() {
    this.getForm().onsubmit = async (event) => {
      event.preventDefault();
      this.clearCredentialError();
      if (this.getUsernameField().value == "") {
        this.triggerCredentialError(this.getUsernameField());
      }
      if(this.getPasswordField().value == "") {
        this.triggerCredentialError(this.getPasswordField());
      }
      let loginResponse = 
        await APICalls.postRequests.sendAuthentication(JSONUtils.login.buildLogin(
          this.getUsernameField().value, this.getPasswordField().value), true);
      if (loginResponse.code == 200) {
        this.showLoginWarningBox(false);
      } else if (loginResponse.code == 401) {
        this.triggerCredentialError(this.getUsernameField());
        this.triggerCredentialError(this.getPasswordField());
        this.showLoginWarningBox(true);
      }
    }
    
    this.getRegisterButton().onclick = () => {
      let registrationEvt = new CustomEvent(events.userSpecific.register);
      document.dispatchEvent(registrationEvt);
    }
  }
}

let loginClass = new LoginPage();

document.addEventListener(events.apiActions.authFailure, () => {
  if (mainGlobalVariables.page.currentPageLoc == events.userSpecific.register) {
    return;
  }
  mainHandler.contentHandling.purgePageContent();
  loginClass.load();
});
document.addEventListener(events.userSpecific.login, () => {
  mainHandler.contentHandling.purgePageContent();
  loginClass.load();
});

document.addEventListener(events.apiActions.authSuccess, () => {
  if (loginClass.isReady()) {
    loginClass.clearCredentials();
  }
  mainHandler.contentHandling.purgePageContent();
});
