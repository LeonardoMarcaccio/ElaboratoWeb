document.body.onload = () => {
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
    console.log("Daje Roma");
}