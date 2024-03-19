let navButtons = document.getElementsByClassName("nav-button");
let loader = new AssetLoader("/components/");

for (let btnElement of navButtons) {
  let eventName = btnElement.id.replace("nav-", "");
  btnElement.onclick = async () => {
    let page = await loader.loadAsset("/" + eventName + "/" + eventName, {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
    mainHandler.contentHandling.setBodyContent(new ElementHandler(await page[0].text()).getContent());
    let event = new CustomEvent(eventName, {detail: btnElement});
    document.dispatchEvent(event);
  };
};
