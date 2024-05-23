class SettingsPage extends DynamicPage {
  async load() {
    await super.load("/settings/settings");
    if (mainGlobalVariables.buttonData.lastSelection != "settings") {
      mainGlobalVariables.buttonData.lastSelection = "settings";
      history.pushState({location: events.userSpecific.settings}, null, "settings");
    }
  }
}

let settingsClass = new SettingsPage();
