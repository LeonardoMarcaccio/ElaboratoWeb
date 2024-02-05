const loginElements = {
  emailField: document.getElementById("login-email"),
  loginField: document.getElementById("login-email"),
  loginBtn: document.getElementById("login-email"),
  registerBtn: document.getElementById("login-email")
}

loginElements.loginBtn.onclick = () => {
  APICalls.postRequests.sendAuthentication(JSONUtils.login(
    loginElements.loginField.value));
}
