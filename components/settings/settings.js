class SettingsPage extends DynamicPage {
  async load() {
    if (mainGlobalVariables.buttonData.lastSelection != "settings") {
      mainGlobalVariables.buttonData.lastSelection = "settings";
      history.pushState({location: events.userSpecific.settings}, null, "settings");
    }
    await super.load("/settings/settings");
    this.bindEventListeners();
  }

  getDeleteAccountButton() {
    return this.lazyNodeIdQuery("settings-input-logout-account", true);
  }
  getLogoutButton() {
    return this.lazyNodeIdQuery("settings-input-delete-account", true);
  }
  getSettingsForm() {
    return this.lazyNodeIdQuery("settings-form", true);
  }
  getDangerZoneSettingsForm() {
    return this.lazyNodeIdQuery("settings-section-account-danger", true);
  }
  
  bindEventListeners() {
    this.getSettingsForm().onsubmit = async (event) => {
      event.preventDefault();
      await APICalls.postRequests.sendLogout();
      updateLoginStatus();
    };
    this.getDangerZoneSettingsForm().onclick = async (event) => {
      event.preventDefault();
    };
  }
}

let settingsClass = new SettingsPage();

document.addEventListener(events.userSpecific.settings, () => {
  settingsClass.load();
});
