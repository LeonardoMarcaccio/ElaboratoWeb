flushMainContentPage();
if (mainGlobalVariables.lastSelection != null) {
    document.getElementById("footer-" + mainGlobalVariables.lastSelection).disabled = false;
}
document.getElementById("footer-" + mainGlobalVariables.selector).disabled = true;
mainGlobalVariables.lastSelection = mainGlobalVariables.selector;

/*
SWITCH REPLACEMENT
DOMUtilities.loadAndAdd(mainGlobalVariables.page.mainContentPage, mainGlobalVariables.selector + ".html");
DOMUtilities.loadAndAdd(mainGlobalVariables.page.mainContentPage, mainGlobalVariables.selector + ".js");
*/

switch(mainGlobalVariables.selector) {
    case mainConstants.actionBar.HOME:
        DOMUtilities.loadAndAdd(mainGlobalVariables.page.mainContentPage, mainGlobalVariables.selector + ".html");
    break;
    case mainConstants.actionBar.SEARCH:

    break;
    case mainConstants.actionBar.POST:

    break;
    case mainConstants.actionBar.CHAT:

    break;
    case mainConstants.actionBar.PROFILE:
        DOMUtilities.loadAndAdd(mainGlobalVariables.page.mainContentPage, mainGlobalVariables.selector + ".html");
    break;
    default:
        throw new Error("Action "+selector+" not supported!");
}