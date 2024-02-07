const loginElements = {
  usernameField: document.getElementById("login-username"),
  passwField: document.getElementById("login-passw"),
  loginBtn: document.getElementById("login-login"),
  registerBtn: document.getElementById("login-goto-register")
}

const loginFunctions = {
  triggerCredentialErrror: (element) => {
    element.classList.add("wrong");
  },
  clearCredentialError: () => {
    loginElements.usernameField.classList.remove("wrong");
    loginElements.passwField.classList.remove("wrong");
  }
}

document.addEventListener(APIEvents.unauthorizedEvent, () => {
  new PageLoader(mainGlobalVariables.page.mainContentFooting);  //NOSONAR
  new PageLoader(mainGlobalVariables.page.mainContentHeading);  //NOSONAR
  let pageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage);
  pageLoader.loadPage("login");
});

loginElements.loginBtn.onclick = () => {
  loginFunctions.clearCredentialError();
  if (loginElements.usernameField.value == "") {
    loginFunctions.triggerCredentialErrror(loginElements.usernameField);
  }
  if(loginElements.passwField.value == "") {
    loginFunctions.triggerCredentialErrror(loginElements.passwField);
    return;
  }
  APICalls.postRequests.sendAuthentication(JSONUtils.login.buildLogin(
    loginElements.usernameField.value, loginElements.passwField.value), true);
}

loginElements.registerBtn.onclick = () => {
  let pageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage);
  pageLoader.loadPage("registration");
}
