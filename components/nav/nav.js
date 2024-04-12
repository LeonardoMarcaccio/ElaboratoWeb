let navButtons = document.getElementsByClassName("nav-button");
let loader = new AssetLoader("/components/");
let cacheMap = new Map();

for (let btnElement of navButtons) {
  let eventName = btnElement.id.replace("nav-", "");
  btnElement.onclick = async () => {
    let page = null;
    if (!cacheMap.has(eventName)) {
      page = await loader.loadAsset("/" + eventName + "/" + eventName, {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
      cacheMap.set(eventName, new ElementHandler(await page[0].text()).getContent());
    }
    page = cacheMap.get(eventName);
    if (eventName == "search") {
      mainHandler.contentHandling.clearBodyContent();
      mainHandler.contentHandling.setHeadingContent(page);
    } else {
      mainHandler.contentHandling.clearHeadingContent();
      mainHandler.contentHandling.setBodyContent(page);
    }
    let event = new CustomEvent(eventName, {detail: btnElement});
    document.dispatchEvent(event);
  };
};
