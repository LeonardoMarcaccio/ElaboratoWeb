class ProfilePage extends DynamicPage {
  async load() {
    if (mainGlobalVariables.buttonData.lastSelection != "profile") {
      mainGlobalVariables.buttonData.lastSelection = "profile";
      history.pushState({location: events.actionBar.profile}, null, "profile");
    }
    if (this.cached) {
      mainHandler.contentHandling.setBodyContent(this.cachedAsset);
      this.userData = await this.populateElement();
      return;
    }
    await super.load("profile/profile");
    await this.populateElement();
    this.bindListeners();
    this.userData = null;
    this.cachedAsset = Array.prototype.slice.call(mainHandler.contentHandling.getBodyContent().getContent().childNodes);
  }

  async retrieveUserData() {
    this.userData = await APICalls.getRequests.getUserInfo();
  }

  getUserImage() {
    return this.lazyNodeIdQuery("profile-user-image", true);
  }
  getUsernameArea() {
    return this.lazyNodeIdQuery("profile-user-username", true);
  }
  getUserFirstNameArea() {
    return this.lazyNodeIdQuery("profile-user-firstname", true);
  }
  getUserLastNameArea() {
    return this.lazyNodeIdQuery("profile-user-lastname", true);
  }
  getBioTitle() {
    return this.lazyNodeIdQuery("profile-user-bio-title", true);
  }
  getBioContent() {
    return this.lazyNodeIdQuery("profile-user-bio", true);
  }
  getPersonalWebsiteTitle() {
    return this.lazyNodeIdQuery("profile-user-personal-website-title", true);
  }
  getPersonalWebsiteText() {
    return this.lazyNodeIdQuery("profile-user-personal-website", true);
  }
  getPhoneNumberTitle() {
    return this.lazyNodeIdQuery("profile-user-phone-number-title", true);
  }
  getPhoneNumberText() {
    return this.lazyNodeIdQuery("profile-user-phone-number", true);
  }

  bindListeners() {

  }
  
  async retrieveUserData() {
    let tmpData = await APICalls.getRequests.getUserInfo();
    return tmpData.response;
  }

  async populateElement(targetUser = null) {
    if (targetUser != null) {
      // NOTE: Incorrect, but had to put this here to remember
      //this.userData = await this.retrieveUserData(targetUser);
    } else {
      this.userData = await this.retrieveUserData();
    }
    if (typeof this.userData === 'undefined') {
      return;
    }
    this.getUsernameArea().innerHTML = genericUtilities.setIfNotNull(this.userData.username);
    this.getUserFirstNameArea().innerHTML = "<b>"+genericUtilities.setIfNotNull(this.userData.firstname)+"</b>";
    this.getUserLastNameArea().innerHTML = "<b>"+genericUtilities.setIfNotNull(this.userData.lastname)+"</b>";
    if (this.userData.biography != null) {
      this.getBioContent().innerHTML = this.userData.biography;
      this.getBioContent().style.color = "black";
    } else {
      this.getBioContent().innerHTML = "Tell the world more about yourself!";
      this.getBioContent().style.color = "gray";
    }
    if (this.userData.personalwebsite != null) {
      this.getPersonalWebsiteTitle().style.display = "block";
      this.getPersonalWebsiteText().style.display = "block";
      this.getPersonalWebsiteText().href = this.userData.personalwebsite;
      this.getPersonalWebsiteText().innerHTML = this.userData.personalwebsite;
    } else {
      this.getPersonalWebsiteTitle().style.display = "none";
      this.getPersonalWebsiteText().style.display = "none";
    }
    if (this.userData.phonenumber != null) {
      this.getPhoneNumberTitle().style.display = "block";
      this.getPhoneNumberText().style.display = "block";
      this.getPhoneNumberText().innerHTML = this.userData.phonenumber;
    } else {
      this.getPhoneNumberTitle().style.display = "none";
      this.getPhoneNumberText().style.display = "none";
    }
    this.getUserImage().src = genericUtilities.setIfNotNull(window.location.href + this.userData.pfp,
      window.location.href + "media/users/placeholder.webp");
  }
}

let profileClass = new ProfilePage();

document.addEventListener(events.actionBar.profile, () => {
  profileClass.load();
})

