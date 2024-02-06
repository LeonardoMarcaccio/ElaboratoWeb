let profilePageLoader = new PageLoader(mainGlobalVariables.page.mainContentPage, mainGlobalVariables.page.mainContentPage.childElementCount);
let profileButtonHandler = new ButtonHandler(profilePageLoader, ["posts","comments","settings"], "profile-", null, []);
profileButtonHandler.activate();

let pgloadTest = new PageLoader(mainGlobalVariables.page.mainContentHeading);
pgloadTest.loadPage("profileHeading");