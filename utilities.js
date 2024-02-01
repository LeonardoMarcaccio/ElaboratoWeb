const deviceUtilities = {
  mobileOsList: [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ],
  isMobileOs: () => {
    return toMatch.some((toMatchItem) => {
      return RegExp(toMatchItem).exec(navigator.userAgent);
    });
  }
}

const genericUtilities = {
  namespaceAsVector: (namespace) => {
    let resultingVector = [];
    for(let singleProperty in namespace) {
      resultingVector.push(singleProperty);
    }
    return resultingVector;
  }
}

const cookieUtilities = {
  addCookie: (name, value, expiration, path) => {
    if (name instanceof String
      && value instanceof String
      && expiration instanceof Date
      && path instanceof String) {
      document.cookie = name+"="+value+"; "+"expires="+expiration+"; "+path;
    }
  },
  readCookie: (name) => {
    if (name instanceof String) {
      decodeURIComponent(document.cookie).split(";").forEach((value) => {
        let cookieEntry = value.trim();
        if (cookieEntry.startsWith(name)) {
          return cookieEntry.substring(name.length, cookieEntry.length);
        }
      });
    }
  }
}

let documentUtilities = {
  scriptCache: new Array(),
  addCssFile: (pathToFile) => {
    if (typeof pathToFile === 'string') {
      let css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = pathToFile;
      document.body.appendChild(css);
    } else {
      throw new Error("Invalid path: "+pathToFile);
    }
  },
  addScriptFile: (pathToFile, onLoadFunc = () => {}) => {
    if (!documentUtilities.scriptCache.includes(pathToFile)) {
      let scriptTag = document.createElement("script");   //NOSONAR
      scriptTag.src = pathToFile;
      if (onLoadFunc instanceof Function) {
        scriptTag.onload = () => onLoadFunc.call();
      }
      document.body.appendChild(scriptTag);
      documentUtilities.scriptCache.push(pathToFile);
    }
  }
}

const AJAXUtilities = {
  HTTPMethods: {
    GET: "GET",
    HEAD: "HEAD",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    CONNECT: "CONNECT",
    OPTIONS: "OPTIONS",
    TRACE: "TRACE",
    PATCH: "PATCH",
  },
  fireSimpleAJAXRequest: (method, url, onSuccess = () => {}, body = "", onFailure = () => {}) => {
    return new Promise((resolved, rejected) => {
      let httpRequest = new XMLHttpRequest();
      httpRequest.open(method, url);
      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
          onSuccess(httpRequest.responseText);
          resolved(httpRequest.responseText);
        }
      };
      try {
        httpRequest.send();
      } catch (err) {
        onFailure(err);
        rejected(err);
      }
    })
  }
}

const AssetManager = {
  defaultAssetPath: "/components/",
  extensionsToFetchFor: ["js","html","css"],
  loadAsset: async (assetName) => {
    if (typeof assetName == 'string') {
      let separatedPath = assetName.split(".");
      if (separatedPath.length >= 2
        && AssetManager.extensionsToFetchFor.includes(separatedPath[separatedPath.length-1])) {
        return await AJAXUtilities.fireSimpleAJAXRequest(AJAXUtilities.HTTPMethods.GET, 
          AssetManager.defaultAssetPath+separatedPath[separatedPath.length-2]
          +"/"
          +separatedPath[separatedPath.length-2]
          +"."
          +separatedPath[separatedPath.length-1]);
      } else {
        throw new Error("Unsupported asset extension: " + separatedPath[separatedPath.length-1]);
      }
    } else {
      throw new Error("Parameter passed is not a String!");
    }
  }
}

const DOMUtilities = {
  addChildElementToNode: (elementToAdd, node) => {
    let tmp = document.createElement("template");
    tmp.innerHTML = node;
    elementToAdd.appendChild(tmp.content);
  },
  removeChildElementsToNode: (elementToRemove, remaining) => {
    let reverseStack = new Array();
    while (elementToRemove.childElementCount > remaining) {
      reverseStack.push(elementToRemove.removeChild(elementToRemove.lastChild));
    }
    return reverseStack;
  },
  customAdd: (elementToAdd, node, func) => {
    let tmp = document.createElement("template");
    tmp.innerHTML = node;
    func(elementToAdd, tmp.content);
  },
  loadAndAdd: async (src, add) => {
    let obtainedAsset = await AssetManager.loadAsset(add);
    DOMUtilities.addChildElementToNode(src, obtainedAsset);
  }
}

const JSONUtils = {
  registration: {
    buildRegistration: (username, email, password, firstname = null, lastname = null,   //NOSONAR
      gender = null, biography = null, personalwebsite = null, pfp = null, phonenumbers = []) => {
      return {"username":username, "email":email, "password":password, "firstname":firstname,
        "lastname":lastname, "gender":gender, "biography":biography,
        "personalwebsite":personalwebsite, "pfp":pfp, "phonenumbers":phonenumbers};
    }
  },
  login: {
    buildLogin: (email, password) => {
      return {"email":email, "password":password};
    }
  },
  post: {
    buildPost: () => {}
  }
}

class PageLoader {
  pageCache = new Map();
  prevPage = null;
  base;
  remainingAmount;

  constructor (base, remainingAmount) {
    this.base = base;
    this.remainingAmount = remainingAmount;
  }

  async loadPage (page) {
    let lambdaOperation = null;
    if (!this.pageCache.has(page)) {
      lambdaOperation = async () => {
        let obtainedAsset = await AssetManager.loadAsset(page + ".html");
        DOMUtilities.addChildElementToNode(this.base, obtainedAsset);
        documentUtilities.addScriptFile("/components/" + page + "/" + page + ".js");
      }
    } else {
      lambdaOperation = async () => {
        let stack = this.pageCache.get(page).slice();
        while (stack.length > 0) {
          this.base.appendChild(stack.pop());
        }
      }
    }
    this.flushPage();
    await lambdaOperation();
    this.prevPage = page;
  }

  flushPage () {
    let bar = document.getElementById("page-dm-lower");
    if (bar != null) {
      document.body.removeChild(bar);
    }
    let tmp = DOMUtilities.removeChildElementsToNode(this.base, this.remainingAmount);
    //  The change occured
    if (this.prevPage != null /*&& !this.pageCache.has(this.prevPage)*/) {
      this.pageCache.set(this.prevPage, tmp);
    }
    this.prevPage = null;
  }
}

class ButtonHandler {
  loader = null;
  eventList = null;
  buttonList = [];
  prefix = null;
  generalChange = null;
  length = 0;
  lastActiveBtn = null;

  constructor (loader, eventList, prefix, generalChange) {
    this.loader = loader;
    this.eventList = eventList;
    this.prefix = prefix;
    this.generalChange = generalChange;
    this.length = this.eventList.length;

    for (let i=0; i<this.length; i++) {
      this.buttonList[i] = document.getElementById(this.prefix + this.eventList[i]);
    }
  }

  activate() {
    for (let i=0; i<this.length; i++) {
      let btn = this.buttonList[i];
      btn.onclick = (btn) => {
          let evt = new CustomEvent(this.buttonList[i].id, {detail: btn.currentTarget});
          document.dispatchEvent(evt);
      }
    }

    for(let i=0; i<this.length; i++) {
      let eventValue = this.eventList[i];
      document.addEventListener((this.prefix + eventValue), async (evt) => {
          this.loader.loadPage(eventValue);
          let pageChangeEvt = new CustomEvent(this.generalChange, {detail: (this.prefix + eventValue)});
          document.dispatchEvent(pageChangeEvt);
      });
    }

    document.addEventListener(this.generalChange, (evt) => {
      let supportedEvents = [];
      for(let i=0; i<this.length; i++) {
          supportedEvents.push(this.prefix + this.eventList[i]);
      }
      if (supportedEvents.includes(evt.detail)) {
        this.buttonList.forEach((namespaceKey) =>{
          if (namespaceKey.id == evt.detail) {
              if (this.lastActiveBtn != null) {
                  this.lastActiveBtn.disabled = false;
              }
              namespaceKey.disabled = true;
              this.lastActiveBtn = namespaceKey;
          }
        });
      }
    })
  }
}