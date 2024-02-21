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
    this.recurse = targetElement instanceof HTMLElement;
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
  constructor(sourceFolder) {
    this.sourceFolder = sourceFolder;
  }
  /**
   * Loads an asset from an external source.
   * @param {string | string[]} assets
   * @returns String containing the request's content
   * @throws Error if the content could not be retrieved
   */
  async loadAsset(assets) {
    let result;
    if (Array.isArray(assets)) {
      result = Array();
      for (let asset in assets) {
        result.push(await fetch(this.sourceFolder + asset));
      }
    } else if (typeof assets === 'string') {
      result = await fetch(this.sourceFolder + asset);
    } else {
      throw new Error("Invalid parameter passed");
    }
    return result;
  }
};
