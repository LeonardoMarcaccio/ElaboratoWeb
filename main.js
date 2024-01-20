let assetPrototypes = new Map();

async function mainPageInit() {
    let header = await AssetManager.loadAsset("header.html");
    DOMUtilities.addChildElementToNode(document.body, header)

    let footer = await AssetManager.loadAsset("footer.html");
    DOMUtilities.addChildElementToNode(document.body, footer)
}

document.body.onload = () => {
    /*
    let a = new ajaxUtilities.SimpleAjaxRequest("GET", "/components/header/header.html", (x) => {
        console.log(x.responseText);
        let tmp = document.createElement("template");
        tmp.innerHTML = x.responseText;
        document.body.appendChild(tmp.content);
        console.log("Yauuuuuuuuuuuuuuuuuu");
    }, 5);
    
    let b = new ajaxUtilities.SimpleAjaxRequest("GET", "/components/footer/footer.html", (x) => {
        console.log(x.responseText);
        let tmp = document.createElement("template");
        tmp.innerHTML = x.responseText;
        document.body.appendChild(tmp.content);
        console.log("Yauuuuuuuuuuuuuuuuuu");
    }, 5);

    a.fire();
    b.fire();
    */

    /*
    loadElements(["/components/header/header.html","/components/footer/footer.html"]);
    console.log("Daje Roma");
    */

    mainPageInit();
}

function loadElements(array) {
    array.forEach(element => {
        let e = new ajaxUtilities.SimpleAjaxRequest("GET", element, (x) => {
            console.log(x.responseText);
            let tmp = document.createElement("template");
            tmp.innerHTML = x.responseText;
            document.body.appendChild(tmp.content);
            console.log("OK");
        }, 5);

        e.fire();
    });
}