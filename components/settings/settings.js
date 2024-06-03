class SettingsPage extends DynamicPage {
  constructor() {
    super();
    this.passwordMatchError = false;
    this.oldPasswordMatchError = false;
    this.pageId = events.userSpecific.settings;
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
    mainGlobalVariables.page.currentPageLoc = this.pageId;
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
  getWarningBox() {
    return this.lazyNodeIdQuery("settings-warning-box");
  }
  showVisualUpdate(visible, text, error = false) {
    if (visible) {
      this.getWarningBox().classList.remove("generic-update-box-hidden");
      if (error) {
        this.getWarningBox().classList.remove("generic-update-box-fine");
        this.getWarningBox().classList.add("generic-update-box-error");
      } else {
        this.getWarningBox().classList.remove("generic-update-box-error");
        this.getWarningBox().classList.add("generic-update-box-fine");
      }
    } else {
      this.getWarningBox().classList.add("generic-update-box-hidden");
    }
    this.getWarningBox().innerHTML = "";
    let warningText = document.createElement("p");
    warningText.innerHTML = text;
    this.getWarningBox().appendChild(warningText);
  }
  
  bindEventListeners() {
    this.getAccountActionsForm().onsubmit = async (event) => {
      event.preventDefault();
      await APICalls.postRequests.sendLogout();
      mainGlobalVariables.userData.userLoggedIn = false;
      updateLoginStatus();
    };
    this.getEditProfileForm().onsubmit = async (event) => {
      event.preventDefault();
      let editProfileForm = new FormData(this.getEditProfileForm());
      let pfp = null;
      try {
        pfp = await JSONUtils.registration.imgToJSON(editProfileForm.get("settings-editprofile-pfp"));
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
            editProfileForm.get("settings-editprofile-firstname"), null), tmpData.firstname),
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-lastname"), null) , tmpData.lastname),
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-gender"), null), tmpData.gender),
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-bio"), null), tmpData.biography),
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-personalwebsite"), null), tmpData.personalwebsite),
        pfp,
        genericUtilities.setIfNotEmpty(
          genericUtilities.setIfNotNull(
            editProfileForm.get("settings-editprofile-phonenumber"), null), tmpData.phonenumber)
      );
      let editUserResult = await APICalls.postRequests.editUserRequest(usrUpdate);
      if (editUserResult.code == 200) {
        this.showVisualUpdate(true, "Upates registered successfully!", false);
      } else {
        this.showVisualUpdate(true, "An error occourred while updating your profile", true);
      }
      mainGlobalVariables.page.mainContentPage.getContent().scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      tmpData = await APICalls.getRequests.getUserInfo();
      this.getCurrentProfileImage().src = tmpData.response.pfp;
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
