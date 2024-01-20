let assetPrototypes = new Map();

function mainPageInit(array) {
    array.forEach(async element => {
        let e = await AssetManager.loadAsset(element);
        DOMUtilities.addChildElementToNode(document.body, e);
    });
}

function mainPageInit(array) {
    array.forEach(async element => {
        let e = await AssetManager.loadAsset(element);
        DOMUtilities.addChildElementToNode(document.body, e);
    });
}

document.body.onload = () => {
   mainPageInit(["header.html", "footer.html"]);
}