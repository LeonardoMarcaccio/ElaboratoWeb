const profileUserElements = {
  username: document.getElementById("profile-user-username"),
  profilepicture: document.getElementById("profile-user-image"),
  firstname: document.getElementById("profile-user-firstname"),
  lastname: document.getElementById("profile-user-lastname"),
  biotitle: document.getElementById("profile-user-bio-title"),
  bio: document.getElementById("profile-user-bio"),
  personalwebsitetitle: document.getElementById("profile-user-personal-website-title"),
  personalwebsite: document.getElementById("profile-user-personal-website"),
  phonenumbertitle: document.getElementById("profile-user-phone-number-title"),
  phonenumber: document.getElementById("profile-user-phone-number"),
}

let pgloadTest = new PageLoader(mainGlobalVariables.page.mainContentHeading);

async function refreshprofileUserInfo() {
  let userInfo = await APICalls.getRequests.getUserInfo();
  let userData = userInfo.response;

  profileUserElements.username.innerHTML = genericUtilities.setIfNotNull(userData.username);
  profileUserElements.firstname.innerHTML = "<b>"+genericUtilities.setIfNotNull(userData.firstname)+"</b>";
  profileUserElements.lastname.innerHTML = "<b>"+genericUtilities.setIfNotNull(userData.lastname)+"</b>";
  if (userData.biography != null) {
    profileUserElements.bio.innerHTML = userData.biography;
    profileUserElements.bio.style.color = "black";
  } else {
    profileUserElements.bio.innerHTML = "Tell the world more about yourself!";
    profileUserElements.bio.style.color = "gray";
  }
  if (userData.personalwebsite != null) {
    profileUserElements.personalwebsitetitle.style.display = "block";
    profileUserElements.personalwebsite.style.display = "block";
    profileUserElements.personalwebsite.href = userData.personalwebsite;
    profileUserElements.personalwebsite.innerHTML = userData.personalwebsite;
  } else {
    profileUserElements.personalwebsitetitle.style.display = "none";
    profileUserElements.personalwebsite.style.display = "none";
  }
  if (userData.phonenumber != null) {
    profileUserElements.phonenumbertitle.style.display = "block";
    profileUserElements.phonenumber.style.display = "block";
    profileUserElements.phonenumber.innerHTML = userData.phonenumber;
  } else {
    profileUserElements.phonenumbertitle.style.display = "none";
    profileUserElements.phonenumber.style.display = "none";
  }
  profileUserElements.profilepicture.src = genericUtilities.setIfNotNull(userData.pfp, window.location.href+"/media/users/placeolder.webp");
}

refreshprofileUserInfo();
