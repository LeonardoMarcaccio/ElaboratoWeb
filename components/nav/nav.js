let mainPageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage, 0);
let headPageLoader = new PageLoader(mainGlobalVariables.page.mainContentHeading, 0);
let generalButtonHandler = new ButtonHandler(null,
    ["feed", "search", "post", "chat", "profile"], "nav-", "mainContentPageChange", null);
mainPageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage, 0);
headPageLoader = new PageLoader(mainGlobalVariables.page.mainContentHeading, 0);
let footPageLoader = new PageLoader(mainGlobalVariables.page.mainContentFooting, 0);
generalButtonHandler = new ButtonHandler(null, ["feed", "search", "post", "chat", "profile"], "nav-", "mainContentPageChange", null);
generalButtonHandler.activate();
let mainButtonHandler = new ButtonHandler(mainPageLoader, ["feed", "post", "chat"], "nav-", "mainContentPageChange", [headPageLoader, footPageLoader]);
mainButtonHandler.activate();
let headButtonHandler = new ButtonHandler(headPageLoader, ["search", "profile"], "nav-", "mainContentPageChange", [mainPageLoader, footPageLoader]);
headButtonHandler.activate();
