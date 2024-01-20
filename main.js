document.body.onload = () => {
    let a = new ajaxUtilities.SimpleAjaxRequest("GET", "/components/header/header.html", (x) => {
        console.log(x.responseText);
        let tmp = document.createElement("template");
        tmp.innerHTML = x.responseText;
        document.body.appendChild(tmp.content);
        console.log("OK");
    }, 5);

    let b = new ajaxUtilities.SimpleAjaxRequest("GET", "/components/profile/profile.html", (x) => {
        console.log(x.responseText);
        let tmp = document.createElement("template");
        tmp.innerHTML = x.responseText;
        document.body.appendChild(tmp.content);
        console.log("OK");
    }, 5);

    a.fire();
    b.fire();

    //loadElements(["/components/header/header.html", "/components/footer/footer.html"]);
    console.log("Daje Roma");
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
