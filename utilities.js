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
  },
  setIfNotNull: (value, returnIfNull = "") => {
    if (value != null) {
      return value;
    } else {
      return returnIfNull;
    }
  }
}

const cookieUtilities = {
  addCookie: (name, value, expiration, path) => {
    document.cookie = name+"="+value+"; "+"expires="+expiration+"; "+path;
  },
  readCookie: (name) => {
    let entry = "";
    decodeURIComponent(document.cookie).split(";").forEach((value) => {
      let cookieEntry = value.trim();
      if (cookieEntry.startsWith(name)) {
        entry = cookieEntry.substring(name.length, cookieEntry.length);
      }
    });
    return entry;
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
  stringToTemplate: (node) => {
    let tmp = document.createElement("template");
    tmp.innerHTML = node;
    return tmp;
  },
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
  },
  /**
   * Adds a script tag to a given element.
   * @param {ElementHandler | HTMLElement} destination  target element to append
   * @param {URL} scriptSrc                             path to the script file
   * @returns {Promise<void>}                           a promise that will
   *                                                    complete once the element
   *                                                    is ready
   */
  addScript: (destination = document.body, scriptSrc) => {
    return new Promise((success, failure) => {
    let scriptTag = document.createElement("script");
    scriptTag.src = scriptSrc;
    scriptTag.onload = success;
    scriptTag.onerror = failure;
    if (destination instanceof ElementHandler) {
      destination.addContent(scriptTag);
    } else {
      destination.appendChild(scriptTag);
    }});
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
    registration: "api/auth/registration.php",
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
    return new URL(path, window.location.href);
  },
  addUrlPageSelection: (url, page, maxPerPage) => {
    if (page != null && maxPerPage != null) {
      url.searchParams.append("pageIndex", page);
      url.searchParams.append("pageSize", maxPerPage);
    }
  },
  /**
   * Assumes that the JSON is well-formed based on the API documentation
   * fires events based on response codes inside the received JSON.
   * @param {JSON} jsonModule  the JSON object to parse
   */
  evaluateResponseCodeAction: (jsonModule) => {
    switch (jsonModule.code) {
      case 401:
      case "401":
        document.dispatchEvent(new CustomEvent(events.apiActions.authFailure));
      break;
      case 409:
      case "409":
        document.dispatchEvent(new CustomEvent(APIEvents.conflictEvent));
      break;
      default:
        return;
    }
  },
  /**
   * A collection of methods that perform API calls using the POST method.
   */
  postRequests: {
    /**
     * Sends POST request to a given URI and returns a JSON response.
     * @param {URL} URL           the request's target destination
     * @param {string} postData   the request's content
     * @return {JSON}             a JSON response
     */
    postDataToApi: async (URL, postData = null) => {
      let postMsg = await fetch(URL, {
        method: AJAXUtilities.HTTPMethods.POST,
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
      let jsonContent = await postMsg.json();
      APICalls.evaluateResponseCodeAction(jsonContent);
      return jsonContent;
    },
    /**
     * Sends authentication data to the api.
     * @param {JSON} registrationData   registration data to send
     * @param {Boolean} isLogin         wether to format data for a login or a registration
     * @returns                         a JSON response
     * @see {@link APICalls.postRequests.postDataToApi}
     */
    sendAuthentication: async (registrationData, isLogin = false) => {
      let authRequest = await APICalls.postRequests.postDataToApi(isLogin
        ? APICalls.createApiUrl(APIConstants.apiPages.login)
        : APICalls.createApiUrl(APIConstants.apiPages.registration),
        registrationData);
      if (authRequest.code == "200") {
        let customEvt = new CustomEvent(events.apiActions.authSuccess);
        document.dispatchEvent(customEvt);
      }
      return authRequest;
    },
    sendCommunityRequest: async (communityData, target = null) => {
      let communityUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      communityUrl.searchParams.append("type", APIConstants.communityActions.types.community);
      if (target != null) {
        communityUrl.searchParams.append("target", target);
      }
      let communityRequest = await APICalls.postRequests.postDataToApi(communityUrl, communityData);
      return communityRequest;
    },
    sendPostRequest: async (postData, target = null) => {
      let postUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      postUrl.searchParams.append("type", APIConstants.communityActions.types.post);
      if (target != null) {
        postUrl.searchParams.append("target", target);
      }
      let postRequest = await APICalls.postRequests.postDataToApi(postUrl, postData);
      return postRequest;
    },
    sendCommentRequest: async (commentData, target = null) => {
      let commentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      commentUrl.searchParams.append("type", APIConstants.communityActions.types.comment);
      if (target != null) {
        commentUrl.searchParams.append("target", target);
      }
      let commentRequest = await APICalls.postRequests.postDataToApi(commentUrl, commentData);
      return commentRequest;
    },
    sendSubcommentRequest: async (subcommentData, target = null) => {
      let subCommentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      subCommentUrl.searchParams.append("type", APIConstants.communityActions.types.subcomment);
      if (target != null) {
        subCommentUrl.searchParams.append("target", target);
      }
      let subCommentRequest = await APICalls.postRequests.postDataToApi(subCommentUrl, subcommentData);
      return subCommentRequest;
    },
    editCommunityRequest: async (communityData, target = null) => {

    },
    sub: async (community) => {
      let subCommentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      subCommentUrl.searchParams.append("type", "sub");
      subCommentUrl.searchParams.append("target", community);
      let subResponse = await APICalls.postRequests.postDataToApi(subCommentUrl);
      return subResponse;
    },
    unsub: async (community) => {
      let subCommentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      subCommentUrl.searchParams.append("type", "unsub");
      subCommentUrl.searchParams.append("target", community);
      let unsubResponse = await APICalls.postRequests.postDataToApi(subCommentUrl);
      return unsubResponse;
    },
    vote: async (post, value) => {
      let subCommentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      subCommentUrl.searchParams.append("type", "vote");
      subCommentUrl.searchParams.append("target", post);
      subCommentUrl.searchParams.append("vote", value);
      let unsubResponse = await APICalls.postRequests.postDataToApi(subCommentUrl);
      return unsubResponse;
    },
    sendMessageRequest: async (target, text) => {
      let commentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      commentUrl.searchParams.append("type", "message");
      commentUrl.searchParams.append("target", target);
      let commentRequest = await APICalls.postRequests.postDataToApi(commentUrl, text);
      return commentRequest;
    }
  },
  getRequests: {
    getDataToApi: async (getData = null, URI) => {
      let postMsg = await fetch(URI, {
        method: AJAXUtilities.HTTPMethods.GET,
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
        },
        body: getData != null ? JSON.stringify(getData) : getData
      });
      let jsonContent = await postMsg.json();
      APICalls.evaluateResponseCodeAction(jsonContent);
      return jsonContent;
    },
    getCommunitiesRequest: async (communityName, page = null, maxPerPage = null) => {
      let communityUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      communityUrl.searchParams.append("type", APIConstants.communityActions.types.community);
      communityUrl.searchParams.append("target", communityName);
      APICalls.addUrlPageSelection(communityUrl, page, maxPerPage);
      let communityRequest = await APICalls.getRequests.getDataToApi(null, communityUrl);
      return communityRequest;
    },
    getSubbedCommunitiesRequest: async (username, page = null, maxPerPage = null) => {
      let communityUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      communityUrl.searchParams.append("type", "subbedCommunities");
      communityUrl.searchParams.append("target", username);
      APICalls.addUrlPageSelection(communityUrl, page, maxPerPage);
      let communityRequest = await APICalls.getRequests.getDataToApi(null, communityUrl);
      return communityRequest;
    },
    getPostsRequest: async (targetCommunityId, page = null, maxPerPage = null) => {
      let postUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      postUrl.searchParams.append("type", APIConstants.communityActions.types.post);
      postUrl.searchParams.append("target", targetCommunityId);
      APICalls.addUrlPageSelection(postUrl, page, maxPerPage);
      let postRequest = await APICalls.getRequests.getDataToApi(null, postUrl);
      return postRequest;
    },
    getCommentsRequest: async (targetPostId, page = null, maxPerPage = null) => {
      let commentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      commentUrl.searchParams.append("type", APIConstants.communityActions.types.comment);
      commentUrl.searchParams.append("target", targetPostId);
      APICalls.addUrlPageSelection(commentUrl, page, maxPerPage);
      let commentRequest = await APICalls.getRequests.getDataToApi(null, commentUrl);
      return commentRequest;
    },
    getSubcommentsRequest: async (targetCommentId, page = null, maxPerPage = null) => {
      let subCommentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      subCommentUrl.searchParams.append("type", APIConstants.communityActions.types.subcomment);
      subCommentUrl.searchParams.append("target", targetCommentId);
      APICalls.addUrlPageSelection(subCommentUrl, page, maxPerPage);
      let subCommentRequest = await APICalls.getRequests.getDataToApi(null, subCommentUrl);
      return subCommentRequest;
    },
    getSubcommentsAmount: async (targetCommentId) => {
      let subCommentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      subCommentUrl.searchParams.append("type", APIConstants.communityActions.types.subcomment);
      subCommentUrl.searchParams.append("target", targetCommentId);
      let subCommentRequest = await APICalls.getRequests.getDataToApi(null, subCommentUrl);
      return subCommentRequest;
    },
    getUserInfo: async (username = null) => {
      let userUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      userUrl.searchParams.append("type", "userinfo");
      if (username != null) {
        userUrl.searchParams.append("target", username);
      }
      let userRequest = await APICalls.getRequests.getDataToApi(null, userUrl);
      return userRequest;
    },
    getFriendList: async (username) => {
      let userUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      userUrl.searchParams.append("type", "friendlist");
      userUrl.searchParams.append("target", username);
      let friendlist = await APICalls.getRequests.getDataToApi(null, userUrl);
      return friendlist;
    },
    isFollowing: async (community) => {
      let userUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      userUrl.searchParams.append("type", "checkSub");
      userUrl.searchParams.append("target", community);
      let communityFollow = await APICalls.getRequests.getDataToApi(null, userUrl);
      return communityFollow;
    },
    getSingleVote: async (post) => {
      let userUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      userUrl.searchParams.append("type", "vote");
      userUrl.searchParams.append("target", post);
      let communityFollow = await APICalls.getRequests.getDataToApi(null, userUrl);
      return communityFollow;
    },
    getMessagesRequest: async (targetFriend, page = null, maxPerPage = null) => {
      let commentUrl = APICalls.createApiUrl(APIConstants.apiPages.communities);
      commentUrl.searchParams.append("type", "message");
      commentUrl.searchParams.append("target", targetFriend);
      APICalls.addUrlPageSelection(commentUrl, page, maxPerPage);
      let commentRequest = await APICalls.getRequests.getDataToApi(null, commentUrl);
      return commentRequest;
    }
  }
}

const JSONUtils = {
  mapJsonVals: (obj) => {
    if (obj === null || obj === undefined) {
      return obj;
    }
  
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return obj.map((item) => replaceEmptyWithNull(item));
      } else {
        const result = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            result[key] = JSONUtils.mapJsonVals(obj[key]);
          }
        }
        return result;
      }
    } else {
      return obj === "" ? null : obj;
    }
  },
  registration: {
    imgToJSON: async (imageFile) => {
      let reader = new FileReader();
      let rfile = new Promise((accepted, rejected) => {
        reader.onload = () => {
          accepted(reader.result);
        }
        reader.onerror = () => {
          rejected(new Error("Could not read file!"));
        }
      });
      reader.readAsBinaryString(imageFile);
      let readFile = await rfile;

      let encodedProfilePicture = btoa(readFile);
      let profilePictureExtension = imageFile.name.split(".")[1];

      return {
          "image":encodedProfilePicture != "" ? encodedProfilePicture : null,
          "format":encodedProfilePicture != "" ? profilePictureExtension : null
          };
    },
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
    buildLogin: (username, password) => {
      return {"username":username, "password":password};
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

function printUserInfo(userInfo) {
  let all = document.createElement("div");
  let head = document.createElement("div");
  let pfp = document.createElement("img");
  let username = document.createElement("p");
  let gender = document.createElement("p");
  let bio = document.createElement("p");
  let website = document.createElement("p");

  all.style.display = "flex";
  all.style.flexDirection = "column";
  head.style.display = "flex";
  head.style.flexDirection = "row";
  username.innerText = userInfo.username;
  pfp.src = userInfo.pfp;
  gender.innerText = userInfo.gender;
  bio.innerText = userInfo.biography;
  website.innerText = userInfo.personalwebsite;

  all.appendChild(head);
  head.appendChild(pfp);
  head.appendChild(username);
  head.appendChild(gender);
  all.appendChild(bio);
  all.appendChild(website);
  return all;
}

function openUserPage(username) {
  headPageLoader.flushPage();
  mainPageLoader.flushPage();
  footPageLoader.flushPage();
  let userInfo = APICalls.getRequests.getUserInfo(username);
  let head = document.createElement("p");
  head.innerText = username;
  mainGlobalVariables.page.mainContentHeading.appendChild(head);
  mainGlobalVariables.page.mainContentPage.appendChild(printUserInfo(userInfo));
  
  if (userInfo.friendship != "self") {
    let foot = document.createElement("div");
    let footButton = document.createElement("button");
    foot.style.display = "flex";
    foot.style.justifyContent = "center";
    if (userInfo.friendship == "no") {
      footButton.innerText = "Send friend request";
      footButton.onclick = () => {
        //APICalls
        footButton.style.disabled = true;
        footButton.innerText = "Friend request sent";
      };
    } else {
      footButton.style.disabled = true;
      footButton.innerText = "Friend request sent";
    }
    foot.appendChild(footButton);
    mainGlobalVariables.page.mainContentFooting.appendChild(foot);
  }
}

class PostBuilder {
  count = 0;
  defaultPfp = "./media/users/placeholder.webp";
  IDPrefix = "";

  constructor (IDPrefix) {
    this.IDPrefix = IDPrefix;
    this.defaultColor = "rgb(255, 255, 255)";
    this.clickedColor = "#5DADE2";
  }

  async makePost (titleString, userPfp, userString, srcCommunityString, paragraphString, postImg, postId) {
      let container = document.createElement("div");
      let post = document.createElement("article");
      let head = document.createElement("div");
      let userImage = document.createElement("img");
      let title = document.createElement("h1");
      let srcCommunity = document.createElement("h2");
      let paragraph = document.createElement("p");
      let buttons = document.createElement("nav");
      let like = document.createElement("button");
      let dislike = document.createElement("button");
      let comment = document.createElement("button");
      const bar = document.createElement("form");
      let flag = true;

      post.id = this.IDPrefix + "-post-" + this.count++;
      post.className = "post";
      post.style.margin = "10px";
      head.style.display = "flex";
      head.style.gap = "10px";
      userImage.src = userPfp != null ? userPfp : this.defaultPfp;
      userImage.style.aspectRatio = "1/1";
      userImage.style.width = "2%";
      title.innerText = titleString;
      title.style.marginBlockStart = "0px";
      title.style.marginBlockEnd = "0px";
      srcCommunity.innerText = "by " + userString + ", from " + srcCommunityString;
      srcCommunity.style.fontSize = "80%";
      paragraph.innerText = paragraphString;
      paragraph.style.textAlign = "left";
      paragraph.className = 0;
      like.innerText = "Like";
      dislike.innerText = "Dislike";
      comment.innerText = "Comment";
      like.style.background = this.defaultColor;
      dislike.style.background = this.defaultColor;
      
      let currentVote = await APICalls.getRequests.getSingleVote(postId);
      currentVote = currentVote.response;
      if (currentVote === -1) {
        dislike.style.background = this.clickedColor;
      } else if (currentVote === 1) {
        like.style.background = this.clickedColor;
      }

      like.onclick = async () => {
        await APICalls.postRequests.vote(postId, 1);
        like.style.background = like.style.background == this.defaultColor ? this.clickedColor : this.defaultColor;
        dislike.style.background = this.defaultColor;
      };
      dislike.onclick = async () => {
        await APICalls.postRequests.vote(postId, 0);
        dislike.style.background = dislike.style.background == this.defaultColor ? this.clickedColor : this.defaultColor;
        like.style.background = this.defaultColor;
      };
      comment.onclick = () => {
        if (comment.innerText == "Comment") {
          comment.innerText = "Undo";
          if (flag) {
            flag = false;
            let input = document.createElement("textarea");
            let send = document.createElement("input");
            
            bar.style.display = "flex";
            input.placeholder = "Reply";
            input.style.resize = "none";
            input.style.width = "300px";
            send.type = "button";
            send.value = "Send";
            bar.appendChild(input);
            bar.appendChild(send);
            send.onclick = async () => {
              let username = await APICalls.getRequests.getUserInfo();
              username = username.response;
              await APICalls.postRequests.sendCommentRequest(JSONBuilder.build(["date", "content", "username", "id"], ["", input.value, username.username, 0]), postId);
            }
          }
          container.appendChild(bar);
        } else {
          comment.innerText = "Comment";
          container.removeChild(bar);
        }
      };

      userImage.onclick = () => openUserPage(userString);

      paragraph.onclick = async () => {
        if (paragraph.className == 0) {
          let comments = await APICalls.getRequests.getCommentsRequest(postId, 1, 10);
          comments = comments.response;
          let builder = new CommentBuilder(titleString);
          for (let i in comments) {
            let numSubComments = await APICalls.getRequests.getSubcommentsAmount(comments[i].id);
            numSubComments = numSubComments.response;
            let tmp = builder.makeComment(comments[i].username, comments[i].content, comments[i].date, comments[i].id, numSubComments[0].count);
            container.appendChild(tmp);
            paragraph.className++;
          }
        } else {
          while (paragraph.className > 0) {
            container.removeChild(container.lastChild);
            paragraph.className--;
          }
        }
      }

      container.appendChild(post);
      post.appendChild(head);
      head.appendChild(userImage);
      head.appendChild(title);
      post.appendChild(srcCommunity);
      if (postImg != null) {
          let postImage = document.createElement("img");
          postImage.src = postImg;
          post.appendChild(postImage);
      }
      post.appendChild(paragraph);
      post.appendChild(buttons);
      buttons.appendChild(like);
      buttons.appendChild(dislike);
      buttons.appendChild(comment);
      
      return container;
  }
}

class CommunityBuilder {
  count = 0;
  defaultImage = "./media/users/placeholder.webp";
  IDPrefix = "";
  
  constructor (IDPrefix) {
      this.IDPrefix = IDPrefix;
  }
  
  makeCommunity(titleString, descString, commImg) {
      let community = document.createElement("article");
      let head = document.createElement("div");
      let image = document.createElement("img");
      let title = document.createElement("h1");
      let follow = document.createElement("button");
      let desc = document.createElement("p");
      let countPosts = 0;
      
      community.id = this.IDPrefix + "-community-" + this.count++;
      community.className = "community";
      community.style.margin = "10px";
      head.style.display = "flex";
      head.style.gap = "10px";
      image.src = commImg != null ? commImg : this.defaultImage;
      image.style.aspectRatio = "1/1";
      image.style.maxWidth = "2%";
      title.innerText = titleString;
      title.style.marginBlockStart = "0px";
      title.style.marginBlockEnd = "0px";
      //  Need to test this with login
      //follow.innerText = (await APICalls.getRequests.isFollowing(titleString)).response[0] ? "Unfollow" : "Follow";
      follow.innerText = "Follow";
      desc.innerText = descString;
      desc.style.textAlign = "left";
      
      community.appendChild(head);
      head.appendChild(image);
      head.appendChild(title);
      head.appendChild(follow);
      community.appendChild(desc);

      desc.onclick = async () => {
        if (countPosts == 0) {
          let posts = await APICalls.getRequests.getPostsRequest(titleString, 0, 10);
          posts = posts.response;
          let builder = new PostBuilder("search");
          for (let i in posts) {
            posts[i];
            community.appendChild(
              builder.makePost(posts[i].title, null, posts[i].username, posts[i].name, posts[i].content, posts[i].image, posts[i].postId));
          countPosts++;
          }
        } else {
          for (; countPosts > 0; countPosts--) {
            community.removeChild(community.lastChild);
          }
        }
      }

      follow.onclick = async () => {
        if (follow.innerText == "Follow") {
          await APICalls.postRequests.sub(titleString);
        } else {
          await APICalls.postRequests.unsub(titleString);
        }
      };

      return community;
  }
}

class CommentBuilder {
  count = 0;
  defaultImage = "./media/users/placeholder.webp";
  IDPrefix = "";

  constructor (IDPrefix) {
      this.IDPrefix = IDPrefix;
  }

  makeComment(userString, contentString, dateString, id, numSubComments, isSub = false) {
    let container = document.createElement("div");
    let comment = document.createElement("article");
    let head = document.createElement("div");
    let user = document.createElement("h1");
    let date = document.createElement("h2");
    let content = document.createElement("p");
    let pfp = document.createElement("img");
    let buttons = document.createElement("nav");
    let userPfp = null;

    comment.id = this.IDPrefix + "-comment-" + this.count++;
    comment.className = "comment";
    comment.style.margin = "10px";
    head.style.display = "flex";
    head.style.gap = "10px";
    user.innerText = userString;
    user.style.marginBlockStart = "0px";
    user.style.marginBlockEnd = "0px";
    date.innerText = dateString;
    date.style.fontSize = "80%";
    content.innerText = contentString;
    content.style.textAlign = "left";
    pfp.src = userPfp != null ? userPfp : this.defaultImage;
    pfp.style.aspectRatio = "1/1";
    pfp.style.maxWidth = "2%";
    
    container.appendChild(comment);
    comment.appendChild(head);
    head.appendChild(pfp);
    head.appendChild(user);
    head.appendChild(date);
    comment.appendChild(content);
    comment.appendChild(buttons);
    
    user.onclick = () => openUserPage(userString);

    let reply = document.createElement("button");
    reply.innerText = "Reply";
    const bar = document.createElement("form");
    let flag = true;
    reply.onclick = () => {
      if (reply.innerText == "Reply") {
        reply.innerText = "Undo";
        if (flag) {
          flag = false;
          let input = document.createElement("textarea");
          let send = document.createElement("input");
          
          bar.style.display = "flex";
          input.placeholder = "Reply";
          input.style.resize = "none";
          input.style.width = "300px";
          send.type = "button";
          send.value = "Send";
          bar.appendChild(input);
          bar.appendChild(send);
          send.onclick = async () => {
            let username = await APICalls.getRequests.getUserInfo();
            username = username.response;
            await APICalls.postRequests.sendSubcommentRequest(JSONBuilder.build(["date", "content", "username", "id"], ["", input.value, username.username, 0]), id);
          }
        }
        container.appendChild(bar);
      } else {
        reply.innerText = "Reply";
        container.removeChild(bar);
      }
    };
    buttons.appendChild(reply);

    if (numSubComments != 0) {
      let thread = document.createElement("button");
      thread.innerText = "See " + numSubComments + " replies";
      buttons.appendChild(thread);
      thread.onclick = async() => {
        let replies = await APICalls.getRequests.getSubcommentsRequest(id, 1, numSubComments);
        replies = replies.response;
        for (let i in replies) {
          let tmp = replies[i];
          let moreSubComments = await APICalls.getRequests.getSubcommentsAmount(tmp.CommentID);
          moreSubComments = moreSubComments.response;
          container.appendChild(this.makeComment(tmp.Username, tmp.Content, tmp.Date, tmp.CommentID, moreSubComments[0].count, true));
        }
        buttons.removeChild(thread);
      };
    }

    return container;
  }
}

const JSONBuilder = {
  /**
   * Creates a JSON object
   * 
   * @param {string[]} fieldArray the array containing the field names
   * @param {string[]} valueArray the array containing the corresponding values
   * @returns the JSON object
   */
  build(fieldArray, valueArray) {
    let limit = fieldArray.length - 1;
    let tmp = "{";
    for (let i=0; i<limit+1; i++) {
      if (typeof valueArray[i] == 'string') {
        tmp += ('"' + fieldArray[i] + '" : "' + valueArray[i] + ((i != limit) ? '", ' : '"}'));
      } else if (typeof valueArray[i] == 'object') {
        tmp += ('"' + fieldArray[i] + '" : ' + JSON.stringify(valueArray[i]) + ((i != limit) ? ', ' : '}'));
      } else {
        tmp += ('"' + fieldArray[i] + '" : ' + valueArray[i] + ((i != limit) ? ', ' : '}'));
      }
    }
    return JSON.parse(tmp);
  }
}

class ContentLoader {
  constructor (loadMethod) {
    this.currentPage = 1;
    this.loadMethod = () => {};
    this.switchLoadMethod(loadMethod);
  }

  switchLoadMethod(loadMethod) {
    this.loadMethod = loadMethod;
  }

  loadMore() {
    this.loadMethod(this.currentPage++);
  }

  reset() {
    this.currentPage = 0;
  }
}