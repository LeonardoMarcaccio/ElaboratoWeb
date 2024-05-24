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
  
  bindEventListeners() {
    this.getDeleteAccountButton().onclick = () => {

    };
    this.getLogoutButton().onclick = async () => {
      await APICalls.postRequests.sendLogout();
      updateLoginStatus();
    };
  }
}

let settingsClass = new SettingsPage();

document.addEventListener(events.userSpecific.settings, () => {
  settingsClass.load();
});
