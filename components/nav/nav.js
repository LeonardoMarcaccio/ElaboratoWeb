mainPageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage, 0);
headPageLoader = new PageLoader(mainGlobalVariables.page.mainContentHeading, 0);
generalButtonHandler = new ButtonHandler(null, ["feed", "search", "post", "chat", "profile"], "nav-", "mainContentPageChange", null);
generalButtonHandler.activate();
mainButtonHandler = new ButtonHandler(mainPageLoader, ["feed", "post"], "nav-", "mainContentPageChange", [headPageLoader]);
mainButtonHandler.activate();
headButtonHandler = new ButtonHandler(headPageLoader, ["search", "chat", "profile"], "nav-", "mainContentPageChange", [mainPageLoader]);
headButtonHandler.activate();
