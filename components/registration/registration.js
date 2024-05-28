class RegistrationPage extends DynamicPage {
  async load() {
    if (mainGlobalVariables.buttonData.lastSelection != "register") {
      mainGlobalVariables.buttonData.lastSelection = "register";
      history.pushState({location: events.userSpecific.register}, null, "register");
    }
    await super.load("registration/registration");
    this.registrationForm = null;
    this.registrationEssentialForm = null;
    this.username = null;
    this.usernameTakenError = null;
    this.usernameSpecialCharError = null;
    this.email = null;
    this.emailTakenError = null;
    this.password = null;
    this.passwordError = null;
    this.passwordRetype = null;
    this.passwordRetypeError = null;
    this.usernameTakenError = null;
    this.registrationNonEssentialForm = null;
    this.firstname = null;
    this.lastname = null;
    this.gender = null;
    this.biography = null;
    this.personalWebsite = null;
    this.profilePicture = null;
    this.phoneNumber = null;
    this.submitButton = null;
    this.addInfoButton = null;

    this.bindListeners();
  }

  getRegistrationForm() {
    return this.lazyNodeIdQuery("registration-form");
  }

  getRegistrationEssentialForm() {
    return this.lazyNodeIdQuery("registration-essential");
  }

  getUsername() {
    return this.lazyNodeIdQuery("registration-username");
  }

  getUsernameTakenError() {
    return this.lazyNodeIdQuery("registration-username-taken-error");
  }

  getUsernameSpecialCharError() {
    return this.lazyNodeIdQuery("registration-username-specialchar-error");
  }

  getEmail() {
    return this.lazyNodeIdQuery("registration-email");
  }

  getEmailTakenError() {
    return this.lazyNodeIdQuery("registration-email-taken-error");
  }

  getPassword() {
    return this.lazyNodeIdQuery("registration-password");
  }

  getPasswordError() {
    return this.lazyNodeIdQuery("registration-password-error");
  }

  getPasswordRetype() {
    return this.lazyNodeIdQuery("registration-password-retype");
  }

  getPasswordRetypeError() {
    return this.lazyNodeIdQuery("registration-password-retype-error");
  }

  getEssentialElements() {
    let essentialElements = new Array();
    essentialElements.push(this.getUsername());
    essentialElements.push(this.getUsernameTakenError());
    essentialElements.push(this.getUsernameSpecialCharError());
    essentialElements.push(this.getEmail());
    essentialElements.push(this.getEmailTakenError());
    essentialElements.push(this.getPassword());
    essentialElements.push(this.getPasswordError());
    essentialElements.push(this.getPasswordRetype());
    essentialElements.push(this.getPasswordRetypeError());
    return essentialElements;
  }

  getRegistrationNonEssentialForm() {
    return this.lazyNodeIdQuery("registration-non-essential");
  }

  getFirstname() {
    return this.lazyNodeIdQuery("registration-firstname");
  }

  getLastname() {
    return this.lazyNodeIdQuery("registration-lastname");
  }

  getGender() {
    return this.lazyNodeIdQuery("registration-gender");
  }

  getBiography() {
    return this.lazyNodeIdQuery("registration-biography");
  }

  getPersonalWebsite() {
    return this.lazyNodeIdQuery("registration-personalwebsite");
  }

  getProfilePicture() {
    return this.lazyNodeIdQuery("registration-profilepicture");
  }

  getPhoneNumber() {
    return this.lazyNodeIdQuery("registration-phonenumber");
  }

  getNonEssentialElements() {
    let nonEssentialElements = new Array();
    nonEssentialElements.push(this.getFirstname());
    nonEssentialElements.push(this.getLastname());
    nonEssentialElements.push(this.getGender());
    nonEssentialElements.push(this.getBiography());
    nonEssentialElements.push(this.getPersonalWebsite());
    nonEssentialElements.push(this.getProfilePicture());
    nonEssentialElements.push(this.getPhoneNumber());
    return nonEssentialElements;
  }

  getSubmitButton() {
    return this.lazyNodeIdQuery("registration-send-data");
  }

  getAddInfoButton() {
    return this.lazyNodeIdQuery("registration-show-non-essential");
  }
  
  bindListeners() {
    this.getAddInfoButton().onclick = () => {
      this.getRegistrationNonEssentialForm().style.display = 'flex';
      this.getAddInfoButton().style.display = 'none';
      this.getSubmitButton().innerHTML = "Complete Registration";
    }

    // Checks for page change to clear sent/unused data
    document.addEventListener(events.genericActions.MAINCONTENTPAGECHANGE, () => resetRegistrationPage());

    // Submits data
    this.getRegistrationForm().onsubmit = async (evt) => {
      evt.preventDefault();
      
      this.resetEssentialErrors();
      this.formData = new FormData(this.getRegistrationForm());
      this.username = this.formData.get("registration-username");
      this.email = this.formData.get("registration-email");
      this.password = this.formData.get("registration-password");
      this.passwordRetype = this.formData.get("registration-password-retype");
    
      this.firstname = this.formData.get("registration-firstname");
      this.lastname = this.formData.get("registration-lastname");
      this.gender = this.formData.get("registration-gender");
      this.biography = this.formData.get("registration-biography");
      this.personalwebsite = this.formData.get("registration-personalwebsite");
      this.profilePicture = this.formData.get("registration-profilepicture");
      this.phonenumber = this.formData.get("registration-phonenumber");
      
      if (this.localEssentialFieldsCheck(this.username, this.email, this.password, this.passwordRetype)) {
        return;
      }
    
      let pfp = null;
      try {
        pfp = await JSONUtils.registration.imgToJSON(this.profilePicture);
      } catch (e) {
        console.warn("Could not load Image! Reason:\n" + e);
      }
      console.log(
        JSONUtils.registration.buildRegistration(
          this.username,
          this.email,
          this.password,
          this.firstname,
          this.lastname,
          this.gender,
          this.biography,
          this.personalwebsite,
          pfp,
          this.phonenumber
        )
      );
    
      let response = await APICalls.postRequests.sendAuthentication(
        JSONUtils.mapJsonVals(
          JSONUtils.registration.buildRegistration(
            this.username,
            this.email,
            this.password,
            this.firstname,
            this.lastname,
            this.gender,
            this.biography,
            this.personalwebsite,
            pfp,
            this.phonenumber
          )
        )
      );
      
      console.log(response);
    
      switch (response.code) {
        case 401:
        if (response.hasOwnProperty("response")) {
          this.checkEssentialCredendialEvaluation(response.response);
        }
        break;
        case 409:
          usernameTakenError();
          emailTakenError();
      }
    }
  }
  
  // Resets data inside the page
  resetRegistrationPage() {
    this.getRegistrationEssentialForm().reset();
    this.getNonEssentialElements().reset();
  }
  
  
  resetEssentialErrors() {
    this.getUsername().classList.remove("wrong");
    this.getUsernameTakenError().classList.remove("wrong");
    this.getUsernameSpecialCharError().classList.remove("wrong");
    this.getEmail().classList.remove("wrong");
    this.getEmailTakenError().classList.remove("wrong");
    this.getPassword().classList.remove("wrong");
    this.getPasswordError().classList.remove("wrong");
    this.getPasswordRetype().classList.remove("wrong");
    this.getPasswordRetypeError().classList.remove("wrong");
  }
  
  localEssentialFieldsCheck(username, email, password, passwordRetype) {
    let checkError = false;
    if (username == "") {
      this.getUsername().classList.add("wrong");
    }
    if (email == "") {
      this.getEmail().classList.add("wrong");
    }
    if (password == "") {
      this.getPassword().classList.add("wrong");
      checkError = true;
    }
    if (passwordRetype == "") {
      this.getPasswordRetype().classList.add("wrong");
      checkError = true;
    }
    if (password != passwordRetype) {
      this.getPassword().classList.add("wrong");
      this.getPasswordRetype().classList.add("wrong");
      this.getPasswordRetypeError().style.display = "block";
      checkError = true;
    }
    return checkError;
  }
  
  checkEssentialCredendialEvaluation(evaluationJson) {
    if (!evaluationJson.usernameValidityReport.allTestsPassed) {
      this.usernameError();
    }
    if (!evaluationJson.emailValidityReport.allTestsPassed) {
      this.emailError();
    }
    if (!evaluationJson.passwordValidityReport.allTestsPassed) {
      this.passwdError();
    }
  }
  
  usernameError() {
    this.getUsername().classList.add("wrong");
    this.getUsernameSpecialCharError().style.display = "block";
  }
  
  usernameSpecialCharsError() {
    this.usernameError();
    this.getUsernameSpecialCharError().style.display = "block";
  }

  usernameTakenError() {
    this.usernameError();
    this.getUsernameTakenError().style.display = "block";
  }

  emailError() {
    this.getEmail().classList.add("wrong");
  }
  
  emailTakenError() {
    this.emailError();
    this.getEmailTakenError().style.display = "block";
  }
  
  passwdError() {
    this.getPassword().classList.add("wrong");
    this.getPasswordError().style.display = "block";
  }
}

let registrationPage = new RegistrationPage();

document.addEventListener(events.userSpecific.register, () => {
  mainHandler.contentHandling.purgePageContent();
  registrationPage.load();
});
