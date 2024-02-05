let mainPageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage, 0);
let headPageLoader = new PageLoader(mainGlobalVariables.page.mainContentHeading, 0);
let generalButtonHandler = new ButtonHandler(null,
    ["feed", "search", "post", "chat", "profile"], "nav-", "mainContentPageChange", null);
generalButtonHandler.activate();
let mainButtonHandler = new ButtonHandler(mainPageLoader,
    ["feed", "post"], "nav-", "mainContentPageChange", [headPageLoader]);
    mainButtonHandler.activate();
let headButtonHandler = new ButtonHandler(headPageLoader,
    ["search", "chat", "profile"], "nav-", "mainContentPageChange", [mainPageLoader]);
    headButtonHandler.activate();
