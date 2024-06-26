/**
 * Constants used for contenthandling.
 */
const contentHandlingConsts = {
  /**
   * Supported html extensions.
   */
  htmlExtensions: ["html", "htm"],
  /**
   * Supported css extensions.
   */
  cssExtensions: ["css"],
  /**
   * Supported js extensions.
   */
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
   * @param {object} options                       wether or not to fix linked js
   */
  async addContent(content, options = {ignoreLinkedJs: false}) {
    if (this.recurse) {
      await this.targetElement.addContent(content);
    } else if (content instanceof HTMLElement
      || content instanceof NodeList
      || content instanceof DocumentFragment) {
      let loadTask = new Promise((success, failure) => {
        content.onload = success();
        content.onerror = failure(new Error("Error during element load!"));
        if (content instanceof NodeList) {
          content.forEach(singleNode => {
            if (!options.ignoreLinkedJs || (!options.ignoreLinkedJs && !singleNode instanceof HTMLScriptElement)) {
              this.targetElement.appendChild(this.scriptTagFix(singleNode));
            } else {
              this.targetElement.appendChild(singleNode);
            }
          });
        } else {
          if (!options.ignoreLinkedJs || (!options.ignoreLinkedJs && !content instanceof HTMLScriptElement)) {
            this.targetElement.appendChild(this.scriptTagFix(content));
          } else {
            this.targetElement.appendChild(content);
          }
        }
      });
      await loadTask;
    } else if (typeof content == 'string') {
      let tmpElement = document.createElement("template");
      tmpElement.innerHTML = content;
      let tmpChilds = tmpElement.content;
      tmpChilds = tmpChilds.childNodes;
      this.addContent(tmpChilds);
    } else if (content instanceof Array) {
      for (let singleElement in content) {
        await this.addContent(content[singleElement]);
      }
    } else {
      throw new Error("Wrong type of content added!\nTried to add: " + typeof content);
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
        this.targetElement.removeChild(this.targetElement.lastChild);
      }
    }
  }
  /**
   * Forces parsing of an html script element.
   * @param {HTMLScriptElement} scriptNode the node to be parsed
   */
  scriptTagFix(scriptNode) {
    if (scriptNode instanceof HTMLScriptElement) {
      let newNode = document.createElement("script");
      newNode.src = scriptNode.src;
      return newNode;
    }
    return scriptNode;
  }
};

/**
 * A contract that a dynamic page should respect.
 */
class DynamicPage {
  /**
   * Constructs a DynamicPage object.
   * @param {pageUrl} pageUrl a target URL to load
   * @param {object} opts page options
   */
  constructor(pageUrl = null, opts = {lazy: true, cache: true, autofetch: false, js: false, css: false}) {
    this.cached = false;
    this.sourceUrl = pageUrl;
    this.opts = opts;
    this.nodeMap = new Map();
  }
  /**
   * Orders the dynamic page to load and stores it in cache.
   * @param {path} path         location of the content in the server
   * @param {editBody} editBody wether or not to automatically edit the contentshaper
   */
  async load(path = "", editBody = true) {
    if (path === "") {
      return;
    }

    if (editBody) {
      mainHandler.contentHandling.purgePageContent();
    }
    if (this.opts.cache && this.cached) {
      if (editBody) {
        mainHandler.contentHandling.purgePageContent();
      }
    } else {
      let loader = new AssetLoader("/components/");
      if (this.opts.cache && !this.cached
        || !this.opts.cache) {
        this.cachedAsset = await loader.loadAsset(path, {literalElement: false, loadHtml: true, loadCss: false, loadJs: false});
        this.cachedAsset = new ElementHandler(await this.cachedAsset[0].text());
        this.cached = this.opts.cache;
      }
    }
    if (editBody) {
      mainHandler.contentHandling.setBodyContent(this.cachedAsset.getContent());
    }
    return this.cachedAsset.getContent();
  }
  /**
   * Orders the dynamic page to reset it's content.
   */
  reset() {}
  /**
   * Returns and stores it in an internal cache in order to do a faster search.
   * @param {string} nodeName     the node's id
   * @param {boolean} forceUpdate true to discard cache and force search
   * @returns {HTMLElement}       requested node if it exists
   */
  lazyNodeIdQuery(nodeName, forceUpdate = false) {
    if (!forceUpdate && this.nodeMap.has(nodeName)) {
      return this.nodeMap.get(nodeName);
    } else {
      let node = document.getElementById(nodeName);
      this.nodeMap.set(nodeName, node);
      return node;
    }
  }
}

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
   * @param {object} configuration configuration for the function
   * @returns {Promise<string> | Promise<Error>} String containing the request's content
   * @throws Error if the content could not be retrieved
   */
  async loadAsset(assets, 
    configuration = {
      /**
       * Wether or not the name should represent a resource name or a literal resource name
       * with it's corresponding extension
       */
      literalElement: true,
      /**
       * Wether or not to load the HTML extension (.html)
       */
      loadHtml: false,
      /**
       * Wether or not to load the CSS extension (.css)
       */
      loadCss: false,
      /**
       * Wether or not to load the JS extension (.js)
       */
      loadJs: false
    }) {
    let result;
    let targetAssets;
    // This might need some dry check
    if (configuration.literalElement) {
      targetAssets = assets;
    } else if (assets instanceof Array) {
      targetAssets = Array();
      assets.forEach((singleAssetName) => {
        let pathContainer = this.extractAssetPath(singleAssetName);
        let rawname = this.extractAssetName(singleAssetName);
        let nameVector = this.generateAssetVariantVector(rawname, {html: configuration.loadHtml, htm: false, css: configuration.loadCss, js: configuration.loadJs});
        nameVector.map((singleName) => pathContainer + singleName);
        targetAssets = targetAssets.concat(nameVector);
      });
    } else if (typeof assets == 'string') {
      targetAssets = Array();
      let pathContainer = this.extractAssetPath(assets);
      let rawname = this.extractAssetName(assets);
      let nameVector = this.generateAssetVariantVector(rawname, {html: configuration.loadHtml, htm: false, css: configuration.loadCss, js: configuration.loadJs});
      nameVector.forEach((singleName) => targetAssets.push(pathContainer + singleName));
    } else {
      throw new Error("Wrong type passed while using automatic extension completion!");
    }
    if (targetAssets instanceof Array) {
      result = Array();
      for (let asset in targetAssets) {
        // TODO: simplyfy code and remove output
        let probe = await fetch(this.sourceFolder + targetAssets[asset]);
        result.push(probe);
      }
    } else if (targetAssets instanceof String) {
      result = await fetch(this.sourceFolder + targetAssets);
    } else {
      throw new Error("Invalid parameter passed");
    }
    return result;
  }

  /**
   * Extracts the name from an asset's full path.
   * @param {string} asset the asset's full path
   * @return {string} the asset's name, if available, otherwhise an empty string
   */
  extractAssetName(asset) {
    let indexOfExt = asset.lastIndexOf(".");
    indexOfExt = indexOfExt == -1
      ? asset.length
      : indexOfExt;
    return asset.slice(asset.lastIndexOf("/") + 1,  indexOfExt);
  }
  /**
   * Extracts the path from an asset's full path.
   * @param {string} asset the asset's full path
   * @returns the asset's path, if available, otherwise an empty string
   */
  extractAssetPath(asset) {
    return asset.slice(0, asset.lastIndexOf("/") + 1);
  }
  /**
   * Generates a new Array with variants for the selected file extensions, by default every type
   * @param {string} assetName the raw name of the asset, do not pass extensions
   * @param {string} configuration configuration for the function
   * @returns {Array<string>} an array containing strings with the requested extensions
   */
  generateAssetVariantVector(assetName,
    configuration = {
      /**
       * Wether or not to generate the HTML extension name (.html)
       */
      html: true,
      /**
       * Wether or not to generate the HTML extension name (.htm)
       */
      htm: false,
      /**
       * Wether or not to generate the CSS extension name (.css)
       */
      css: true,
      /**
       * Wether or not to generate the JS extension name (.js)
       */
      js: true
    }) {
    let assetNameVariants = Array();
    if (configuration.html) {
      assetNameVariants.push(assetName + "." + contentHandlingConsts.htmlExtensions[0]);
    } else if (configuration.htm) {
      assetNameVariants.push(assetName + "." + contentHandlingConsts.htmlExtensions[1]);
    }
    if (configuration.css) {
      assetNameVariants.push(assetName + "." + contentHandlingConsts.cssExtensions[0]);
    }
    if (configuration.js) {
      assetNameVariants.push(assetName + "." + contentHandlingConsts.jsExtensions[0]);
    }
    return assetNameVariants;
  }
};
