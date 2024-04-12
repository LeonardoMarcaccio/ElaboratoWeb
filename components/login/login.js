/*
class LoginPage extends DynamicPage {
  async load() {
    super.load();
    if (this.opts.cache && this.cached) {
      mainHandler.contentHandling.purgePageContent();
    } else {
      let loader = new AssetLoader("/components/");
      if (this.opts.cache && !this.cached
        || !this.opts.cache) {
        this.cachedAsset = await loader.loadAsset("/login/login", {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
        this.cached = this.opts.cache;
      }
    }
    mainHandler.contentHandling.setBodyContent(new ElementHandler(await this.cachedAsset[0].text()).getContent());
  }
  reset() {
    super.reset();
  }
}

new LoginPage().load();
*/

const loginElements = {
  usernameField: document.getElementById("login-username"),
  passwField: document.getElementById("login-passw"),
  loginBtn: document.getElementById("login-login"),
  registerBtn: document.getElementById("login-goto-register")
}

const loginFunctions = {
  triggerCredentialError: (element) => {
    element.classList.add("wrong");
  },
  clearCredentialError: () => {
    loginElements.usernameField.classList.remove("wrong");
    loginElements.passwField.classList.remove("wrong");
  }
}

document.addEventListener(APIEvents.unauthorizedEvent, () => {
  mainHandler.contentHandling.purgePageContent();
  //mainHandler.contentHandling.setBodyContent();
});

loginElements.loginBtn.onclick = () => {
  loginFunctions.clearCredentialError();
  if (loginElements.usernameField.value == "") {
    loginFunctions.triggerCredentialError(loginElements.usernameField);
  }
  if(loginElements.passwField.value == "") {
    loginFunctions.triggerCredentialError(loginElements.passwField);
    return;
  }
  APICalls.postRequests.sendAuthentication(JSONUtils.login.buildLogin(
    loginElements.usernameField.value, loginElements.passwField.value), true);
}

loginElements.registerBtn.onclick = () => {
  let pageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage);
  pageLoader.loadPage("registration");
}
