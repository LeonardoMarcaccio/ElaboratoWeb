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

//  PlayPal specific from here on out
const APIEvents = {
  unauthorizedEvent: "api-unauthorized",
  conflictEvent: "api-conflict"
}
const APIConstants = {
  apiPages: {
    login: "api/auth/login.php",
    registration: "api/auth/register.php",
    communities: "api/content/communities.php",
    users: "api/content/users.php",
  },
  communityActions: {
    types: {
      community: "community",
      post: "post",
      comment: "comment",
      subcomment: "subcomment",
      page: "page"
    },
    staticTargets: {
      edit: "edit"
    }
  }

}
const APICalls = {
  createApiUrl: (path) => {
    return new Url(path, window.location.href);
  },
  addUrlPageSelection: (url, page, maxPerPage) => {
    if (page != null && maxPerPage != null) {
      url.searchParams.append("page", page);
      url.searchParams.append("maxPerPage", maxPerPage);
    }
  },
  evaluateResponseCodeAction: (jsonModule) => {
    switch (jsonModule.code) {
      case "401":
        document.dispatchEvent(new CustomEvent(APIEvents.unauthorizedEvent));
      break;
      case "409":
        document.dispatchEvent(new CustomEvent(APIEvents.conflictEvent));
      break;
      default:
        return;
    }
  },
  postRequests: {
    postDataToApi: async (URI, postData = null) => {
      let postMsg = await fetch(URI, {
        method: AJAXUtilities.HTTPMethods.POST,
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
      let jsonContent = postMsg.json();
      APICalls.evaluateResponseCodeAction(jsonContent.code);
      return jsonContent;
    },
    sendAuthentication: async (registrationData, isLogin = false) => {
      let authRequest = await APICalls.postDataToApi(registrationData, 
        isLogin
        ? "api/auth/login.php"
        : "api/auth/registration.php");
      return authRequest;
    },
    sendCommunityRequest: async (communityData, target = null) => {
      let communityUrl = createApiUrl(APIConstants.apiPages.communities);
      communityUrl.searchParams.append("type", APIConstants.communityActions.types.community);
      if (target != null) {
        communityUrl.searchParams.append("target", target);
      }
      let commentRequest = await APICalls.postDataToApi(postData, communityUrl);
      return commentRequest;
    },
    sendPostRequest: async (postData, target = null) => {
      let postUrl = createApiUrl(APIConstants.apiPages.communities);
      postUrl.searchParams.append("type", APIConstants.communityActions.types.post);
      if (target != null) {
        postUrl.searchParams.append("target", target);
      }
      let commentRequest = await APICalls.postDataToApi(postData, postUrl);
      return commentRequest;
    },
    sendCommentRequest: async (commentData, target = null) => {
      let commentUrl = createApiUrl(APIConstants.apiPages.communities);
      commentUrl.searchParams.append("type", APIConstants.communityActions.types.comment);
      if (target != null) {
        commentUrl.searchParams.append("target", target);
      }
      let commentRequest = await APICalls.postDataToApi(postData, commentUrl);
      return commentRequest;
    },
    sendSubcommentRequest: async (subcommentData, target = null) => {
      let subCommentUrl = createApiUrl(APIConstants.apiPages.communities);
      subCommentUrl.searchParams.append("type", APIConstants.communityActions.types.subcomment);
      if (target != null) {
        subCommentUrl.searchParams.append("target", target);
      }
      let commentRequest = await APICalls.postDataToApi(postData, subCommentUrl);
      return commentRequest;
    },
    editCommunityRequest: async (communityData, target = null) => {

    }
  },
  getRequests: {
    getDataToApi: async (URI, getData = null) => {
      let postMsg = await fetch(URI, {
        method: AJAXUtilities.HTTPMethods.GET,
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
        },
        body: getData != null ? JSON.stringify(getData) : getData
      });
      let jsonContent = postMsg.json();
      APICalls.evaluateResponseCodeAction(jsonContent.code);
      return jsonContent;
    },
    getCommunitiesRequest: async (page = null, maxPerPage = null) => {
      let communityUrl = createApiUrl(APIConstants.apiPages.communities);
      communityUrl.searchParams.append("type", APIConstants.communityActions.types.community);
      APICalls.addUrlPageSelection(page, maxPerPage);
      let commentRequest = await APICalls.getDataToApi(postData, communityUrl);
      return commentRequest;
    },
    getPostsRequest: async (targetCommunityId, page = null, maxPerPage = null) => {
      let postUrl = createApiUrl(APIConstants.apiPages.communities);
      communityUrl.searchParams.append("type", APIConstants.communityActions.types.post);
      APICalls.addUrlPageSelection(page, maxPerPage);
      let commentRequest = await APICalls.getDataToApi(postData, postUrl);
      return commentRequest;
    },
    getCommentsRequest: async (targetPostId, page = null, maxPerPage = null) => {
      let commentUrl = createApiUrl(APIConstants.apiPages.communities);
      communityUrl.searchParams.append("type", APIConstants.communityActions.types.comment);
      commentUrl.searchParams.append("target", targetPostId);
      APICalls.addUrlPageSelection(page, maxPerPage);
      let commentRequest = await APICalls.getDataToApi(postData, commentUrl);
      return commentRequest;
    },
    getSubcommentsRequest: async (targetCommentId, page = null, maxPerPage = null) => {
      let subCommentUrl = createApiUrl(APIConstants.apiPages.communities);
      subCommentUrl.searchParams.append("type", APIConstants.communityActions.types.subcomment);
      subCommentUrl.searchParams.append("target", targetCommentId);
      APICalls.addUrlPageSelection(page, maxPerPage);
      let commentRequest = await APICalls.getDataToApi(postData, subCommentUrl);
      return commentRequest;
    }
  }
}

const JSONUtils = {
  registration: {
    buildRegistration: (username, email, password, firstname = null, lastname = null,   //NOSONAR
      gender = null, biography = null, personalwebsite = null, pfp = null, phonenumbers = null) => {
      return {"username":username, "email":email, "password":password,
        "firstname":firstname, "lastname":lastname, "gender":gender,
        "biography":biography, "personalwebsite":personalwebsite,
        "pfp":pfp,
        "phonenumbers":phonenumbers};
    }
  },
  login: {
    buildLogin: (email, password) => {
      return {"email":email, "password":password};
    }
  },
  post: {
    buildPost: () => {}
  },
  pfp: {
    encodePfp: file => {
      return new Promise((completed, rejected) => {
        let pfpReader = new FileReader(file);
        pfpReader.readAsDataURL(file);
        pfpReader.onload = () => {
          completed(JSONUtils.pfp.buildPfp(btoa(pfpReader.result),
            file.substring(file.lastIndexOf('.')+1, file.length) || file));
        };
        prpReader.onerror = () => {
          rejected(new Error("Selected file is not convertible!"));
        }
      });
    },
    buildPfp: (image = null, format = null) => {
      return image == null || format == null
        ? null
        : {"image":image, "format":format};
    }
  },
}

let sharedCache = new Map();

class PageLoader {
  pageCache = sharedCache;
  prevPage = null;
  base;
  remainingAmount;

  constructor (base, remainingAmount = 0) {
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
    let tmp = DOMUtilities.removeChildElementsToNode(this.base, this.remainingAmount);
    if (this.prevPage != null) {
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
  extraFlushes = null;

  constructor (loader, eventList, prefix, generalChange, extraFlushes) {
    this.loader = loader;
    this.eventList = eventList;
    this.prefix = prefix;
    this.generalChange = generalChange;
    this.length = this.eventList.length;
    this.extraFlushes = extraFlushes;

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
      if (this.loader != null) {
        document.addEventListener((this.prefix + eventValue), async (evt) => {
            for (let flush in this.extraFlushes) {
              this.extraFlushes[flush].flushPage();
            }
            this.loader.loadPage(eventValue);
            let pageChangeEvt = new CustomEvent(this.generalChange, {detail: (this.prefix + eventValue)});
            document.dispatchEvent(pageChangeEvt);
        });
      }
    }

    if (this.generalChange != null) {
      document.addEventListener(this.generalChange, (evt) => {
        let supportedEvents = [];
        for(let i=0; i<this.length; i++) {
          supportedEvents.push(this.prefix + this.eventList[i]);
        }
        if (supportedEvents.includes(evt.detail)) {
          this.buttonList.forEach((namespaceKey) => {
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
}