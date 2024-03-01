const contentHandlingConsts = {
  htmlExtensions: ["html", "htm"],
  cssExtensions: ["css"],
  jsExtensions: ["js"]
}

/**
 * Class for an ElementHandler that helps to easily handle content inside
 * html elements of instances of the same class recursively.
 */
class ElementHandler {
  /**
   * Creates an elementUpdater with a target element to alter
   * @param {HTMLElement | ElementHandler} targetElement can either be an
   * htmlelement or a elementhandler, for the last type, function will recourse
   */
  constructor(targetElement) {
    this.targetElement = targetElement;
    this.recurse = !(targetElement instanceof HTMLElement);
  }

  /**
   * @returns the element contained by the elementhandler or another elementhandler
   */
  getContent() {
    return this.targetElement;
  }
  /**
   * Adds content to the elementhandler's handled child.
   * @param {HTMLElement | ElementHandler} content the content to be added
   */
  async addContent(content) {
    if (this.recurse) {
      await this.targetElement.addContent(content);
    } else {
      if (content instanceof HTMLElement) {                           //NOSONAR
        let loadTask = new Promise((success, failure) => {
          content.onload = success();
          content.onerror = failure(new Error("Error during element load!"));
          this.targetElement.appendChild(content);
        });
        await loadTask;
      } else if (content instanceof String) {
        let tmpElement = document.createElement("template");
        tmpElement.innerHTML(content);
        let tmpChilds = tmpElement.childNodes();
        this.addContent(tmpChilds);
      } else if (content instanceof Array) {
        for (let singleElement in content) {
          await this.addContent(singleElement);
        }
      } else {
        throw new Error("Wrong type of content added!");
      }
    }
  }
  /**
   * Removes the content of the handled element by the handler.
   */
  clearContent() {
    if (this.recurse) {
      this.targetElement.clearContent();
    } else {
      while(this.targetElement.firstChild) {
        this.targetElement.removeChild(this.targetElement.lastChild());
      }
    }
  }
};

/**
 * Class for an AssetLoader that can request content from an external server.
 */
class AssetLoader {
  constructor(sourceFolder = "") {
    this.sourceFolder = sourceFolder;
  }
  /**
   * Loads an asset from an external source.
   * @param {string | string[]} assets
   * @returns String containing the request's content
   * @throws Error if the content could not be retrieved
   */
  async loadAsset(assets, configuration = {literalElement: true, loadHtml: false, loadCss: false, loadJs: false}) {
    let result;
    let targetAssets;
    if (configuration.literalElement) {
      targetAssets = assets;
    } else {
      if (assets instanceof Array) {

      } else if (assets instanceof String) {
        let tmpString
      }
    }
    if (Array.isArray(targetAssets)) {
      result = Array();
      for (let asset in targetAssets) {
        result.push(await fetch(this.sourceFolder + asset));
      }
    } else if (targetAssets instanceof String) {
      result = await fetch(this.sourceFolder + targetAssets);
    } else {
      throw new Error("Invalid parameter passed");
    }
    return result;
  }

  /**
   * 
   * @param {String} asset 
   */
  extractAssetName(asset) {
    return asset.slice(asset.lastIndexOf("/") + 1, asset.slice.lastIndexOf("."));
  }
};
