let profilePageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage.childElementCount)

let profileValues = {
    buttons: {
        POSTS: document.getElementById("profile-posts"),
        COMMENTS: document.getElementById("profile-comments"),
        SETTINGS: document.getElementById("profile-settings"),
    },
    lastActiveBtn: null
}

const profileEvents = {
    POSTS: "posts",
    COMMENTS: "comments",
    SETTINGS: "settings"
}

for (let button in profileValues.buttons) {
    let profileBtn = profileValues.buttons[button];
    profileBtn.onclick = (btn) => {
        let evt = new CustomEvent(profileValues.buttons[button].id, {detail: btn.currentTarget});
        document.dispatchEvent(evt);
    }
}

for(let eventEntry in profileEvents) {
    let eventValue = profileEvents[eventEntry];
    document.addEventListener(("profile-" + eventValue), async (evt) => {
        profilePageLoader.loadPage(eventValue, mainGlobalVariables.page.mainContentPage);
    });
}