let assetPrototypes = new Map();

async function loadMultipleAssets(assetArray) {
    for(let asset in assetArray) {
        let obtainedAsset = await AssetManager.loadAsset(assetArray[asset]);
        DOMUtilities.addChildElementToNode(document.body, obtainedAsset);
    }
}

async function mainPageInit() {
    await loadMultipleAssets(["header.html", "footer.html"]);
    let mainPageContent = document.createElement("div");
    mainPageContent.id = "main-content-page";
    document.body.insertBefore(mainPageContent, document.getElementsByTagName("footer")[0]);
    document.getElementById("loading-banner").style.display = "none";
}

document.body.onload = () => {
    mainPageInit();
}