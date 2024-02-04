mainPageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage, 0);
mainButtonHandler = new ButtonHandler(mainPageLoader, ["feed", "search", "post", "chat", "profile"], "nav-", "mainContentPageChange");
mainButtonHandler.activate();

