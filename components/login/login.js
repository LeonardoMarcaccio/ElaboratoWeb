const loginElements = {
  emailField: document.getElementById("login-email"),
  passwField: document.getElementById("login-passw"),
  loginBtn: document.getElementById("login-login"),
  registerBtn: document.getElementById("login-goto-register")
}

const loginFunctions = {
  triggerCredentialErrror: () => {
    loginElements.emailField.classList.add("wrong");
    loginElements.passwField.classList.add("wrong");
  }
}

document.addEventListener(APIEvents.unauthorizedEvent, () => {
  new PageLoader(mainGlobalVariables.page.mainContentFooting);  //NOSONAR
  new PageLoader(mainGlobalVariables.page.mainContentHeading);  //NOSONAR
  let pageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage);
  pageLoader.loadPage("registration");
});

loginElements.loginBtn.onclick = () => {
  if (loginElements.emailField.value == "" && loginElements.passwField.value == "") {
    loginFunctions.triggerCredentialErrror();
    return;
  }
  APICalls.postRequests.sendAuthentication(JSONUtils.login.buildLogin(
    loginElements.emailField.value, loginElements.passwField.value));
}

loginElements.registerBtn.onclick = () => {
  let pageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage);
  pageLoader.loadPage("registration");
}
