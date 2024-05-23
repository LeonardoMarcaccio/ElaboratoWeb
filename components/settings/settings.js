class SettingsPage extends DynamicPage {
  async load() {
    await super.load("/settings/settings");
  }
}
