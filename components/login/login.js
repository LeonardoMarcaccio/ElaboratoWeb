class LoginPage extends DynamicPage {
  async load() {
    super.load();
    // NOTE: Need to rebuild this if condition
    mainHandler.contentHandling.purgePageContent();
    if (this.opts.cache && this.cached) {
      mainHandler.contentHandling.purgePageContent();
    } else {
      let loader = new AssetLoader("/components/");
      if (this.opts.cache && !this.cached
        || !this.opts.cache) {
        this.cachedAsset = await loader.loadAsset("/login/login", {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
        this.cachedAsset = new ElementHandler(await this.cachedAsset[0].text());
        this.cached = this.opts.cache;
        console.log("test123");
      }
    }
    mainHandler.contentHandling.setBodyContent(this.cachedAsset.getContent());
    this.usernameField = null;
    this.passwordField = null;
    this.loginButton = null;
    this.registerButton = null;

    this.bindListeners();
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
  clearCredentialError() {
    this.getUsernameField().classList.remove("wrong");
    this.getPasswordField().classList.remove("wrong");
  }
  bindListeners() {
    this.getLoginButton().onclick = () => {
      this.clearCredentialError();
      if (this.getUsernameField().value == "") {
        this.triggerCredentialError(this.getUsernameField());
      }
      if(this.getPasswordField().value == "") {
        this.triggerCredentialError(this.getPasswordField());
      }
      APICalls.postRequests.sendAuthentication(JSONUtils.login.buildLogin(
        this.getUsernameField().value, this.getPasswordField().value), true);
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

