class ProfilePage extends DynamicPage {
  async load() {
    await super.load("profile/profile");
    await this.retrieveUserData();
    buildContent();
    this.bindListeners();
  }

  async retrieveUserData() {
    this.userData = await APICalls.getRequests.getUserInfo();
  }

  getUserImage() {
    return this.lazyNodeIdQuery("profile-user-image");
  }

  bindListeners() {

  }

  populateElement() {

  }
}

let profileClass = new ProfilePage();

document.addEventListener(events.actionBar.profile, () => {
  profileClass.load();
})

