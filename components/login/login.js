class LoginPage extends DynamicPage {
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
    return this.lazyNodeIdQuery("login-form", true);
  }

  triggerCredentialError(element) {
    element.classList.add("wrong");
  }
  clearCredentialError() {
    this.getUsernameField().classList.remove("wrong");
    this.getPasswordField().classList.remove("wrong");
  }
  bindListeners() {
    this.getForm().onsubmit = (event) => {
      event.preventDefault();
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

document.addEventListener(events.apiActions.authFailure, () => {
  mainHandler.contentHandling.purgePageContent();
  loginClass.load();
});

document.addEventListener(events.apiActions.authSuccess, () => {
  mainHandler.contentHandling.purgePageContent();
});
