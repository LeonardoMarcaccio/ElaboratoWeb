class SettingsPage extends DynamicPage {
  async load() {
    if (mainGlobalVariables.buttonData.lastSelection != "settings") {
      mainGlobalVariables.buttonData.lastSelection = "settings";
      history.pushState({location: events.userSpecific.settings}, null, "settings");
    }
    await super.load("/settings/settings");
  }
}

let settingsClass = new SettingsPage();
