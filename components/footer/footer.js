let footerValues = {
    buttons: {
        HOME: document.getElementById("footer-feed"),
        SEARCH: document.getElementById("footer-search"),
        POST: document.getElementById("footer-post"),
        CHAT: document.getElementById("footer-chat"),
        PROFILE: document.getElementById("footer-profile"),
    },
    lastActiveBtn: null
}

for (let button in footerValues.buttons) {
    let footerBtn = footerValues.buttons[button];
    footerBtn.onclick = (btn) => {
        let evt = new CustomEvent(footerValues.buttons[button].id, {detail: btn.currentTarget});
        document.dispatchEvent(evt);
    }
}

document.addEventListener(events.genericActions.MAINCONTENTPAGECHANGE, (evt) => {
    if (genericUtilities
        .namespaceAsVector(mainPageLocChanges.mainLocations).includes(evt)) {
        let namespaceKeys = genericUtilities.namespaceAsVector(footerValues.buttons);
        for(let element in namespaceKeys) {
            if (footerValues.buttons[element].id == evt.detail) {
                if (footerValues.lastActiveBtn != null) {
                    lastActiveBtn.disabled = false;
                    footerValues.buttons[element].disabled = true;
                }
            }
        }
    }
})
