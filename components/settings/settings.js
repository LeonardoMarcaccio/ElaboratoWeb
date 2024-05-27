class SettingsPage extends DynamicPage {
  async load() {
    if (mainGlobalVariables.buttonData.lastSelection != "settings") {
      mainGlobalVariables.buttonData.lastSelection = "settings";
      history.pushState({location: events.userSpecific.settings}, null, "settings");
    }
    await super.load("/settings/settings");
    this.bindEventListeners();
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
      console.log(editProfileForm);
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
    };
  }
}

let settingsClass = new SettingsPage();

document.addEventListener(events.userSpecific.settings, () => {
  settingsClass.load();
});
