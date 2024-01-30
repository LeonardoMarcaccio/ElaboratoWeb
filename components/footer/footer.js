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
    let supportedEvents = [];
    for(const supportedEKey in events.actionBar) {
        supportedEvents.push("footer-" + events.actionBar[supportedEKey]);
    }
    if (supportedEvents.includes(evt.detail)) {
        let namespaceKeys = [];
        for(const supportedEKey in footerValues.buttons) {
            namespaceKeys.push(footerValues.buttons[supportedEKey]);
        }
        namespaceKeys.forEach((namespaceKey) =>{
                if (namespaceKey.id == evt.detail) {
                    if (footerValues.lastActiveBtn != null) {
                        footerValues.lastActiveBtn.disabled = false;
                    }
                    namespaceKey.disabled = true;
                    footerValues.lastActiveBtn = namespaceKey;
                }
        });
    }
})
