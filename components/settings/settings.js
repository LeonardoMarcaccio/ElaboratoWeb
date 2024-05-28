class SettingsPage extends DynamicPage {
  constructor() {
    super();
    this.passwordMatchError = false;
    this.oldPasswordMatchError = false;
  }
  async load() {
    if (mainGlobalVariables.buttonData.lastSelection != "settings") {
      mainGlobalVariables.buttonData.lastSelection = "settings";
      history.pushState({location: events.userSpecific.settings}, null, "settings");
    }
    await super.load("/settings/settings");
    let tmpData = await APICalls.getRequests.getUserInfo();
    tmpData = await tmpData.response;
    if (tmpData.pfp != null) {
      this.getCurrentProfileImage().src = tmpData.pfp;
    }
    this.bindEventListeners();
  }

  getCurrentProfileImage() {
    return this.lazyNodeIdQuery("settings-editprofile-pfp-current", true);
  }
  getAccountActionsForm() {
    return this.lazyNodeIdQuery("settings-accountactions-form", true);
  }
  getEditProfileForm() {
    return this.lazyNodeIdQuery("settings-editprofile-form", true);
  }
  getDangerZoneForm() {
    return this.lazyNodeIdQuery("settings-dangerzone-form", true);
  }
  getDangerZoneWarningBox() {
    return this.lazyNodeIdQuery("settings-dangerzone-warningbox", true);
  }
  getDangerZoneOldPasswordField() {
    return this.lazyNodeIdQuery("settings-dangerzone-old-password", true);
  }
  getDangerZoneNewPasswordField() {
    return this.lazyNodeIdQuery("settings-dangerzone-password", true);
  }
  getDangerZoneNewPasswordRepeatField() {
    return this.lazyNodeIdQuery("settings-dangerzone-password-repeat", true);
  }
  
  bindEventListeners() {
    this.getAccountActionsForm().onsubmit = async (event) => {
      event.preventDefault();
      await APICalls.postRequests.sendLogout();
      updateLoginStatus();
    };
    this.getEditProfileForm().onsubmit = async (event) => {
      event.preventDefault();
      let editProfileForm = new FormData(this.getEditProfileForm());
      let pfp = null;
      try {
        pfp = await JSONUtils.registration.imgToJSON(profilePicture);
      } catch (e) {
        console.warn("Could not load Image! Reason:\n" + e);
      }
      let tmpData = await APICalls.getRequests.getUserInfo();
      tmpData = await tmpData.response;
      let usrUpdate = JSONUtils.registration.buildRegistration(
        tmpData.username,
        tmpData.email,
        tmpData.password,
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-firstname"), null), tmpData.biography),
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-lastname"), null) , tmpData.lastname),
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-gender"), null), tmpData.gender),
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-bio"), null), tmpData.bio),
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-personalwebsite"), null), tmpData.personalwebsite),
        pfp,
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-phonenumber"), null), tmpData.phonenumber)
      );
      await APICalls.postRequests.editUserRequest(usrUpdate);
    };
    this.getDangerZoneForm().onsubmit = async (event) => {
      event.preventDefault();
      let passwordChangeData = new FormData(this.getDangerZoneForm());
      let oldPassword = passwordChangeData.get("settings-dangerzone-old-password");
      let newPassword = passwordChangeData.get("settings-dangerzone-password");
      let newPasswordRepeat = passwordChangeData.get("settings-dangerzone-password-repeat");
      let preventFurtherExec = false;
      if (oldPassword == "") {
        this.getDangerZoneOldPasswordField().classList.add("wrong");
        preventFurtherExec = true;
      } else {
        this.getDangerZoneOldPasswordField().classList.remove("wrong");
      }
      if (newPassword == "") {
        this.getDangerZoneNewPasswordField().classList.add("wrong");
        preventFurtherExec = true;
      } else {
        this.getDangerZoneNewPasswordField().classList.remove("wrong");
      }
      if (newPasswordRepeat == "") {
        this.getDangerZoneNewPasswordRepeatField().classList.add("wrong");
        preventFurtherExec = true;
      } else {
        this.getDangerZoneNewPasswordRepeatField().classList.remove("wrong");
      }
      if (preventFurtherExec) {
        return;
      }
      if ((newPassword != newPasswordRepeat) && !this.passwordMatchError) {
        this.passwordMatchError = true;
        this.passwordMatchErrorParagraph = document.createElement("p");
        this.passwordMatchErrorParagraph.innerHTML = "Passwords do now match!"
        this.getDangerZoneWarningBox().appendChild(this.passwordMatchErrorParagraph);
        this.getDangerZoneWarningBox().classList.add("generic-warningbox");
        this.getDangerZoneWarningBox().classList.remove("generic-warningbox-inactive");
      } else if ((newPassword == newPasswordRepeat) && this.passwordMatchError) {
        this.passwordMatchError = false;
        this.getDangerZoneWarningBox().removeChild(this.passwordMatchErrorParagraph);
      }
      let passwordTestResult = await APICalls.postRequests.sendTestPassword(oldPassword)
      if (!passwordTestResult && !this.oldPasswordMatchError) {
        this.oldPasswordMatchError = true;
        this.oldPasswordErrorParagraph = document.createElement("p");
        this.oldPasswordErrorParagraph.innerHTML = "Old password is incorrect!"
        this.getDangerZoneWarningBox().appendChild(this.oldPasswordErrorParagraph);
        this.getDangerZoneWarningBox().classList.add("generic-warningbox");
        this.getDangerZoneWarningBox().classList.remove("generic-warningbox-inactive");
      } else if (passwordTestResult && this.oldPasswordMatchError) {
        this.oldPasswordMatchError = false;
        this.getDangerZoneWarningBox().removeChild(this.oldPasswordErrorParagraph);
      }
      if (!this.oldPasswordMatchError && !this.passwordMatchError) {
        this.passwordChangeResult =
          await APICalls.postRequests.sendEditPassword(oldPassword, newPassword);
        if (!this.passwordChangeResult) {
          this.genericPasswordErrorParagraph = document.createElement("p");
          this.genericPasswordErrorParagraph.innerHTML = "An error occourred while changing the password";
          this.getDangerZoneWarningBox().appendChild(this.genericPasswordErrorParagraph);
          this.getDangerZoneWarningBox().classList.add("generic-warningbox");
          this.getDangerZoneWarningBox().classList.remove("generic-warningbox-inactive");
        } else if (this.passwordChangeResult) {
          this.getDangerZoneWarningBox().removeChild(this.oldPasswordErrorParagraph);
        }
      }
      if (this.getDangerZoneWarningBox().childNodes.length == 0) {
        this.getDangerZoneWarningBox().style.visibility = "hidden";
        this.getDangerZoneWarningBox().classList.remove("generic-warningbox");
        this.getDangerZoneWarningBox().classList.add("generic-warningbox-inactive");
      }
    };
  }
}

let settingsClass = new SettingsPage();

document.addEventListener(events.userSpecific.settings, () => {
  settingsClass.load();
});
