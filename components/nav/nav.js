let mainPageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage, 0);
let headPageLoader = new PageLoader(mainGlobalVariables.page.mainContentHeading, 0);
let footPageLoader = new PageLoader(mainGlobalVariables.page.mainContentFooting, 0);
let generalButtonHandler = new ButtonHandler(null,
    ["feed", "search", "post", "chat", "profile"], "nav-", "mainContentPageChange", null);
generalButtonHandler.activate();
let mainButtonHandler = new ButtonHandler(mainPageLoader, ["feed", "post", "chat"], "nav-", "mainContentPageChange", [headPageLoader, footPageLoader]);
mainButtonHandler.activate();
let headButtonHandler = new ButtonHandler(headPageLoader, ["search", "profile"], "nav-", "mainContentPageChange", [mainPageLoader, footPageLoader]);
headButtonHandler.activate();

let postLoader = null;
let communityLoader = null;
let messageLoader = null;
const mainPage = mainGlobalVariables.page.mainContentPage;
mainPage.addEventListener('scroll', () => {
    const scrollableHeight = mainPage.scrollHeight - mainPage.clientHeight;

    if (mainPage.scrollTop >= scrollableHeight) {
        switch (mainPageLoader.prevPage != null ? mainPageLoader.prevPage : headPageLoader.prevPage) {
            case "feed": postLoader.loadMore();
            break;
            case "search": communityLoader.loadMore();
            break;
        }
    }
});