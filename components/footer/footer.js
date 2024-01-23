categories = [mainConstants.actionBar.HOME,
    mainConstants.actionBar.SEARCH,
    mainConstants.actionBar.POST,
    mainConstants.actionBar.CHAT,
    mainConstants.actionBar.PROFILE];

for (let name in categories) {
document.getElementById("footer-" + categories[name]).onclick = function () {
    selectPage(categories[name]);
};
}