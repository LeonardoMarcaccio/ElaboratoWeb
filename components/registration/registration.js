const registrationElements = {
  form: document.getElementById("registration-form"),
  essentialDataField: {
    formDiv: document.getElementById("registration-essential"),
    elements: {
      username: document.getElementById("registration-username"),
      usernameTakenError: document.getElementById("registration-username-taken-error"),
      usernameSpecialCharError: document.getElementById("registration-username-specialchar-error"),
      email: document.getElementById("registration-email"),
      emailTakenError: document.getElementById("registration-email-taken-error"),
      password: document.getElementById("registration-password"),
      passwordError: document.getElementById("registration-password-error"),
      passwordRetype: document.getElementById("registration-password-retype"),
      passwordRetypeError: document.getElementById("registration-password-retype-error"),
    }
  },
  nonEssentialDataField: {
    formDiv: document.getElementById("registration-non-essential"),
    elements: {
      firstname: document.getElementById("registration-firstname"),
      lastname: document.getElementById("registration-lastname"),
      gender: document.getElementById("registration-gender"),
      biography: document.getElementById("registration-biography"),
      personalwebsite: document.getElementById("registration-personalwebsite"),
      profilepicture: document.getElementById("registration-profilepicture"),
      phonenumber: document.getElementById("registration-phonenumber"),
    }
  },
  submitButton: document.getElementById("registration-send-data"),
  addInfoButton: document.getElementById("registration-show-non-essential")
}

// Add more info button action
registrationElements.addInfoButton.onclick = () => {
  registrationElements.nonEssentialDataField.formDiv.style.display = 'flex';
  registrationElements.addInfoButton.style.display = 'none';
  registrationElements.submitButton.innerHTML = "Complete Registration"
}

// Resets data inside the page
function resetRegistrationPage() {
  registrationElements.essentialDataField.formDiv.reset();
  registrationElements.nonEssentialDataField.formDiv.reset();
}

// Checks for page ghange to clear sent/unused data
document.addEventListener(events.genericActions.MAINCONTENTPAGECHANGE,
  () => resetRegistrationPage());

// Submits data
registrationElements.submitButton.onclick = async (evt) => {
  resetEssentialErrors();

  evt.preventDefault();
  let formData = new FormData(registrationElements.form);
  let username = formData.get("registration-username");
  let email = formData.get("registration-email");
  let password = formData.get("registration-password");
  let passwordRetype = formData.get("registration-password-retype");

  let firstname = formData.get("registration-firstname");
  let lastname = formData.get("registration-lastname");
  let gender = formData.get("registration-gender");
  let biography = formData.get("registration-biography");
  let personalwebsite = formData.get("registration-personalwebsite");
  let profilePicture = formData.get("registration-profilepicture");
  let phonenumber = formData.get("registration-phonenumber");
  
  if (localEssentialFieldsCheck(username, email, password, passwordRetype)) {
    return;
  }

  let pfp = null;
  try {
    pfp = await JSONUtils.registration.imgToJSON(profilePicture);
  } catch (e) {
    console.warn("Could not load Image! Reason:\n" + e);
  }
  console.log(JSONUtils.registration.buildRegistration(username, email,
    password, firstname, lastname, gender, biography, personalwebsite,
    pfp, phonenumber));

  let response = await APICalls.postRequests.sendAuthentication(JSONUtils.mapJsonVals(JSONUtils.registration.buildRegistration(username, email,
    password, firstname, lastname, gender, biography, personalwebsite,
    pfp, phonenumber)));
  
  console.log(response);

  switch (response.code) {
    case 401:
    if (response.hasOwnProperty("response")) {
      checkEssentialCredendialEvaluation(response.response);
    }
    break;
    case 409:
      usernameTakenError();
      emailTakenError();
  }
}

function resetEssentialErrors() {
  registrationElements.essentialDataField.elements.username.classList.remove("wrong");
  registrationElements.essentialDataField.elements.email.classList.remove("wrong");
  registrationElements.essentialDataField.elements.passwordRetype.classList.remove("wrong");
  registrationElements.essentialDataField.elements.password.classList.remove("wrong");
  registrationElements.essentialDataField.elements.passwordRetypeError.style.display = "none";
  registrationElements.essentialDataField.elements.passwordError.style.display = "none";
  registrationElements.essentialDataField.elements.emailTakenError.style.display = "none";
  registrationElements.essentialDataField.elements.usernameSpecialCharError.style.display = "none";
  registrationElements.essentialDataField.elements.usernameTakenError.style.display = "none";
}

function localEssentialFieldsCheck(username, email, password, passwordRetype) {
  let checkError = false;
  if (username == "") {
    registrationElements.essentialDataField.elements.username.classList.add("wrong");
  }
  if (email == "") {
    registrationElements.essentialDataField.elements.email.classList.add("wrong");
  }
  if (password == "") {
    registrationElements.essentialDataField.elements.password.classList.add("wrong");
    checkError = true;
  }
  if (passwordRetype == "") {
    registrationElements.essentialDataField.elements.passwordRetype.classList.add("wrong");
    checkError = true;
  }
  if (password != passwordRetype) {
    registrationElements.essentialDataField.elements.passwordRetype.classList.add("wrong");
    registrationElements.essentialDataField.elements.password.classList.add("wrong");
    registrationElements.essentialDataField.elements.passwordRetypeError.style.display = "block";
    checkError = true;
  }
  return checkError;
}

function checkEssentialCredendialEvaluation(evaluationJson) {
  if (!evaluationJson.usernameValidityReport.allTestsPassed) {
    usernameError();
  }
  if (!evaluationJson.emailValidityReport.allTestsPassed) {
    emailError();
  }
  if (!evaluationJson.passwordValidityReport.allTestsPassed) {
    passwordError();
  }
}

function usernameError() {
  registrationElements.essentialDataField.elements.username.classList.add("wrong");
  registrationElements.essentialDataField.elements.usernameSpecialCharError.style.display = "block";
}

function usernameTakenError() {
  usernameError();
  registrationElements.essentialDataField.elements.usernameTakenError.style.display = "block";
}
function usernameSpecialCharsError() {
  usernameError();
  registrationElements.essentialDataField.elements.usernameSpecialCharError.style.display = "block";
}

function emailError() {
  registrationElements.essentialDataField.elements.email.classList.add("wrong");
}

function emailTakenError() {
  emailError();
  registrationElements.essentialDataField.elements.emailTakenError.style.display = "block";
}

function passwordError() {
  registrationElements.essentialDataField.elements.password.classList.add("wrong");
  registrationElements.essentialDataField.elements.passwordError.style.display = "block";
}