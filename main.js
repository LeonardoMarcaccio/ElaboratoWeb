let assetPrototypes = new Map();

async function mainPageInit() {
    let header = await AssetManager.loadAsset("header.html");
    DOMUtilities.addChildElementToNode(document.body, header)

    let footer = await AssetManager.loadAsset("footer.html");
    DOMUtilities.addChildElementToNode(document.body, footer)
}

document.body.onload = () => {
    mainPageInit();
}
