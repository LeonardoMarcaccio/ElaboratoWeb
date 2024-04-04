class LoginPage extends DynamicPage {
  async load() {
    super.load();
    // NOTE: Need to rebuild this if condition
    mainHandler.contentHandling.purgePageContent();
    if (this.opts.cache && this.cached) {
      mainHandler.contentHandling.purgePageContent();
    } else {
      let loader = new AssetLoader("/components/login/");
      if (this.opts.cache && !this.cached
        || !this.opts.cache) {
        this.cachedAsset = await loader.loadAsset("login.html");
        this.cached = this.opts.cache;
      }
    }
    mainHandler.contentHandling.setBodyContent(DOMUtilities.stringToTemplate(this.cachedAsset).childNodes);
    this.usernameField = null;
    this.passwordField = null;
    this.loginButton = null;
    this.registerButton = null;

    bindListeners();
  }
  reset() {
    super.reset();
  }
  
  getUsernameField() {
    return this.lazyNodeIdQuery("login-username");
  }
  getPasswordField() {
    return this.lazyNodeIdQuery("login-passw");
  }
  getLoginButton() {
    return this.lazyNodeIdQuery("login-login");
  }
  getRegisterButton() {
    return this.lazyNodeIdQuery("login-goto-register");
  }

  triggerCredentialError(element) {
    element.classList.add("wrong");
  }
  triggerCredentialError() {

  }
  clearCredentialError() {
    this.getUsernameField().remove("wrong");
    this.getPasswordField().remove("wrong");
  }
  bindListeners() {
    this.getLoginButton().onclick = () => {
      loginFunctions.clearCredentialError();
      if (this.getUsernameField().value == "") {
        this.triggerCredentialError(loginElements.usernameField);
      }
      if(this.getPasswordField().value == "") {
        this.triggerCredentialError(loginElements.passwField);
        return;
      }
      APICalls.postRequests.sendAuthentication(JSONUtils.login.buildLogin(
        this.getUsernameField().value, this.getUsernameField().value), true);
    }
    
    this.getRegisterButton().onclick = () => {
      let registrationEvt = new CustomEvent(events.userSpecific.register);
      document.dispatchEvent(registrationEvt);
    }
  }
}

let loginClass = new LoginPage();

document.addEventListener(APIEvents.unauthorizedEvent, () => {
  mainHandler.contentHandling.purgePageContent();
  //mainHandler.contentHandling.setBodyContent();
});

