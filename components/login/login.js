class LoginPage extends DynamicPage {
  async load() {
    await super.load("/login/login");
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

document.addEventListener(events.apiActions.unauthorizedEvt, () => {
  mainHandler.contentHandling.purgePageContent();
  loginClass.load();
});

document.addEventListener(events.apiActions.authSuccess, () => {
  mainHandler.contentHandling.purgePageContent();
});
