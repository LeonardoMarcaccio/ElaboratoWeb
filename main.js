let assetPrototypes = new Map();

async function mainPageHeaderInit() {
    let header = await AssetManager.loadAsset("header.html");
    DOMUtilities.addChildElementToNode(document.body, header)
}

function mainPageContentInit() {
    let mainContentPage = document.createElement("div");
    mainContentPage.id = 'main-content-page';
    document.body.appendChild(mainContentPage);
}

async function mainPageFooterInit() {
    let footer = await AssetManager.loadAsset("footer.html");
    DOMUtilities.addChildElementToNode(document.body, footer)
}

async function mainPageInit() {
    await mainPageHeaderInit();
    mainPageContentInit();
    await mainPageFooterInit();
    document.getElementById("loading-banner").style.display = "none";
}

document.body.onload = () => {
    mainPageInit();
}
