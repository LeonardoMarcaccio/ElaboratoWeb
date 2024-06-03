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
  },
  setIfNotEmpty: (value, returnIfNull = "") => {
    if (value != "") {
      return value;
    } else {
      return returnIfNull;
    }
  }
}

const cookieUtilities = {
  addCookie(name, value, expiration, path, samesite = "Lax") {
    document.cookie = name + "=" + encodeURIComponent(value) + "; "
      + "expires=" + expiration + "; "
      + "path=" + path + "; "
      + "SameSite=" + samesite;
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
    logout: "api/auth/logout.php",
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
        mainGlobalVariables.userData.userLoggedIn = false;
        document.dispatchEvent(new CustomEvent(events.apiActions.authFailure));
      break;
      case 409:
      case "409":
        mainGlobalVariables.userData.userLoggedIn = false;
        document.dispatchEvent(new CustomEvent(APIEvents.conflictEvent));
      break;
      case 200:
      case "200":
        mainGlobalVariables.userData.userLoggedIn = true;
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
    sendLogout: async () => {
      let logoutUrl = APICalls.createApiUrl(APIConstants.apiPages.logout);
      let logoutRequest = await APICalls.postRequests.postDataToApi(logoutUrl);
      return logoutRequest;
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
    sendTestPassword: async (password) => {
      let passwordTestUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      passwordTestUrl.searchParams.append("type", "testpassword");
      let passwordTestResponse = await APICalls.postRequests.postDataToApi(
        passwordTestUrl, JSONUtils.generic.passwordTestForm(password));
      if (passwordTestResponse.code == 200) {
        return true;
      }
      return false;
    },
    sendEditPassword: async (oldPassword, newPassword) => {
      let passwordTestUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      passwordTestUrl.searchParams.append("type", "editpassword");
      let passwordTestResponse = await APICalls.postRequests.postDataToApi(
        passwordTestUrl, JSONUtils.generic.passwordChangeForm(oldPassword, newPassword));
      if (passwordTestResponse.code == 200) {
        return true;
      }
      return false;
    },
    sendRemoveNotification: async (notificationCode) => {
      let notificationRemovalUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      notificationRemovalUrl.searchParams.append("type", "removeNotification");
      notificationRemovalUrl.searchParams.append("target", notificationCode);
      let notificationUpdateResponse = await APICalls.postRequests.postDataToApi(
        notificationRemovalUrl);
      APICalls.evaluateResponseCodeAction(notificationUpdateResponse);
      return notificationUpdateResponse;
    },
    editUserRequest: async (updateData) => {
      let subCommentUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      subCommentUrl.searchParams.append("type", "edit");
      let editUsrResponse = await APICalls.postRequests.postDataToApi(
        APICalls.createApiUrl(subCommentUrl),
        updateData);
      APICalls.evaluateResponseCodeAction(editUsrResponse);
      return editUsrResponse;
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
    },
    updateFriendStatus: async (user, status) => {
      let friendUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      friendUrl.searchParams.append("type", status ? "friend" : "unfriend");
      friendUrl.searchParams.append("target", user);
      let friendRequest = await APICalls.postRequests.postDataToApi(friendUrl);
      return friendRequest;
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
    getNotifications: async () => {
      let userUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      userUrl.searchParams.append("type", "notification");
      let notifications = await APICalls.getRequests.getDataToApi(null, userUrl);
      APICalls.evaluateResponseCodeAction(notifications);
      return notifications;
    },
    getFriendList: async (username) => {
      let userUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      userUrl.searchParams.append("type", "friendlist");
      userUrl.searchParams.append("target", username);
      let friendlist = await APICalls.getRequests.getDataToApi(null, userUrl);
      return friendlist;
    },
    getIncomingFriends: async (username) => {
      let userUrl = APICalls.createApiUrl(APIConstants.apiPages.users);
      userUrl.searchParams.append("type", "incoming");
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
  generic: {
    passwordTestForm: (password) => {
      return {"password":password};
    },
    passwordChangeForm: (oldPassword, newPassword) => {
      return {"oldPassword":oldPassword, "newPassword":newPassword};
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
  let box = document.createElement("div");
  let pfp = document.createElement("img");
  let baseInfo = document.createElement("div");
  let username = document.createElement("h1");
  let gender = document.createElement("p");
  let bio = document.createElement("p");
  let website = document.createElement("a");

  all.className = "generic-pane";
  head.id = "user-div";
  head.style.display = "flex";
  head.style.flexDirection = "row";
  head.style.justifyContent = "flex-start";
  username.innerText = userInfo.username;
  box.className = "avatar-box";
  pfp.src = userInfo.pfp;
  pfp.style.maxWidth = "90px";
  pfp.alt = "";
  gender.innerText = userInfo.gender;
  gender.style.textAlign = "left";
  bio.innerText = userInfo.biography;
  bio.style.fontStyle = "italic";
  website.innerText = userInfo.personalwebsite;
  website.href = userInfo.personalwebsite;

  all.appendChild(head);
  box.appendChild(pfp);
  head.appendChild(box);
  baseInfo.appendChild(username);
  baseInfo.appendChild(gender);
  head.appendChild(baseInfo);
  all.appendChild(bio);
  all.appendChild(website);
  return all;
}

async function openUserPage(username) {
  mainGlobalVariables.page.mainContentHeading.clearContent();
  mainGlobalVariables.page.mainContentPage.clearContent();
  mainGlobalVariables.page.mainContentFooting.clearContent();
  let userInfo = await APICalls.getRequests.getUserInfo(username);
  userInfo = userInfo.response;
  let page = printUserInfo(userInfo);
  mainGlobalVariables.page.mainContentPage.addContent(page);

  let self = await APICalls.getRequests.getUserInfo();
  self = self.response;
  let bois = await APICalls.getRequests.getFriendList(self.username);
  bois = bois.response;
  
  if (self.username != userInfo.username) {
    let foot = document.createElement("div");
    let footButton = document.createElement("button");
    foot.style.display = "flex";
    foot.style.justifyContent = "center";
    if (bois.filter((x) => x.username == userInfo.username).length == 0) {
      footButton.innerText = "Send friend request";
      footButton.onclick = async () => {
        await APICalls.postRequests.updateFriendStatus(userInfo.username, true);
        footButton.innerText = "Remove friend";
      };
    } else {
      footButton.innerText = "Remove friend";
      footButton.onclick = async () => {
        await APICalls.postRequests.updateFriendStatus(userInfo.username, false);
        footButton.innerText = "Friend request sent";
      };
    }
    foot.appendChild(footButton);
    page.appendChild(foot);
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
    this.postList = new Array();
    this.highlightCount = 0;
  }

  hideOtherPosts(generatedId) {
    for (let i in this.postList) {
      if (this.postList[i].id != generatedId) {
        this.postList[i].style.display = "none";
      }
    }
  }

  showAllPosts() {
    for (let i in this.postList) {
      this.postList[i].style.display = "block";
    }
  }

  async makePost (titleString, userPfp, userString, srcCommunityString, paragraphString, postImg, postId, likes) {
      let container = document.createElement("div");
      let post = document.createElement("article");
      let head = document.createElement("div");
      let userButton = document.createElement("button");
      let box = document.createElement("div");
      let userImage = document.createElement("img");
      let title = document.createElement("h2");
      let srcCommunity = document.createElement("h3");
      let contPar = document.createElement("div");
      let parButton = document.createElement("button");
      let buttons = document.createElement("nav");
      let like = document.createElement("button");
      let dislike = document.createElement("button");
      let comment = document.createElement("button");
      const bar = document.createElement("form");
      let flag = true;
      let curLikes = likes;

      post.id = this.IDPrefix + "-post-" + this.count++;
      post.className = "post";
      post.style.margin = "10px";
      head.style.display = "flex";
      head.style.gap = "10px";
      userButton.style.border = "none";
      userButton.style.margin = "0px";
      userButton.name = userString + "-profile";
      userButton.style.backgroundColor = "transparent";
      box.className = "avatar-box";
      box.style.maxWidth = "30px";
      box.style.maxHeight = "30px";
      userImage.src = userPfp != null ? userPfp : this.defaultPfp;
      userImage.alt = "";
      userImage.style.maxHeight = "30px";
      title.innerText = titleString;
      title.style.marginBlockStart = "0px";
      title.style.marginBlockEnd = "0px";
      srcCommunity.innerText = "by " + userString + ", from " + srcCommunityString;
      srcCommunity.style.fontSize = "80%";
      contPar.style.display = "flex";
      parButton.className = 0;
      parButton.style.border = "none";
      parButton.style.margin = "0px";
      parButton.innerText = paragraphString;
      parButton.name = "open-post-" + titleString;
      parButton.style.backgroundColor = "transparent";
      like.innerText = curLikes + "  Like";
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
        if (like.style.background == this.defaultColor) {
          like.style.background = this.clickedColor;
          if (dislike.style.background != this.defaultColor) {
            curLikes += 2;
          } else {
            curLikes += 1;
          }
        } else {
          like.style.background = this.defaultColor;
          curLikes -= 1;
        }
        like.innerText = curLikes + "  Like";
        dislike.style.background = this.defaultColor;
      };
      dislike.onclick = async () => {
        await APICalls.postRequests.vote(postId, 0);
        if (dislike.style.background == this.defaultColor) {
          dislike.style.background = this.clickedColor;
          if (like.style.background != this.defaultColor) {
            curLikes -= 2;
          } else {
            curLikes -= 1;
          }
        } else {
          dislike.style.background = this.defaultColor;
          curLikes += 1;
        }
        like.innerText = curLikes + "  Like";
        like.style.background = this.defaultColor;
      };
      comment.onclick = () => {
        if (comment.innerText == "Comment") {
          this.hideOtherPosts(post.id);
          this.highlightCount++;
          comment.innerText = "Undo";
          if (flag) {
            flag = false;
            let input = document.createElement("textarea");
            let send = document.createElement("input");
            
            bar.style.display = "flex";
            input.placeholder = "Reply";
            input.style.resize = "none";
            input.style.width = "220px";
            send.type = "button";
            send.value = "Send";
            bar.appendChild(input);
            bar.appendChild(send);
            send.onclick = async () => {
              let username = await APICalls.getRequests.getUserInfo();
              username = username.response;
              await APICalls.postRequests.sendCommentRequest(JSONBuilder.build(["date", "content", "username", "id"], ["", input.value, username.username, 0]), postId);
              comment.innerText = "Comment";
              post.removeChild(bar);
            }
          }
          post.appendChild(bar);
        } else {
          comment.innerText = "Comment";
          post.removeChild(bar);
          this.highlightCount--;
          if (this.highlightCount == 0) {
            this.showAllPosts();
          }
        }
      };

      userButton.onclick = async () => openUserPage(userString);

      parButton.onclick = async () => {
        parButton.style.backgroundColor = "transparent";
        if (parButton.className == 0) {
          this.hideOtherPosts(post.id);
          this.highlightCount++;
          let comments = await APICalls.getRequests.getCommentsRequest(postId, 1, 10);
          comments = comments.response;
          let builder = new CommentBuilder(post.id);
          for (let i in comments) {
            let numSubComments = await APICalls.getRequests.getSubcommentsAmount(comments[i].id);
            numSubComments = numSubComments.response;
            let tmp = builder.makeComment(comments[i].username, comments[i].content, comments[i].date, comments[i].id, numSubComments[0].count);
            container.appendChild(tmp);
            parButton.className++;
          }
        } else {
          while (parButton.className > 0) {
            container.removeChild(container.lastChild);
            parButton.className--;
          }
          this.highlightCount--;
          if (this.highlightCount == 0) {
            this.showAllPosts();
          }
        }
      }

      container.appendChild(post);
      post.appendChild(head);
      userButton.appendChild(userImage);
      box.appendChild(userButton);
      head.appendChild(box);
      head.appendChild(title);
      post.appendChild(srcCommunity);
      if (postImg != null) {
        let postImage = document.createElement("img");
        postImage.src = postImg;
        postImage.style.maxWidth = "220px";
        postImage.alt = "";
        post.appendChild(postImage);
      }
      contPar.appendChild(parButton);
      post.appendChild(contPar);
      post.appendChild(buttons);
      buttons.appendChild(like);
      buttons.appendChild(dislike);
      buttons.appendChild(comment);
      
      this.postList.push(post);
      return container;
  }
}

class CommunityBuilder {
  count = 0;
  defaultImage = "./media/users/placeholder.webp";
  IDPrefix = "";
  
  constructor (IDPrefix, inSearch = true) {
      this.IDPrefix = IDPrefix;
      this.inSearch = inSearch;
  }
  
  async makeCommunity(titleString, descString, commImg) {
      let community = document.createElement("article");
      let head = document.createElement("div");
      let box = document.createElement("div");
      let image = document.createElement("img");
      let title = document.createElement("h2");
      let follow = document.createElement("button");
      let bottom = document.createElement("div");
      let open = document.createElement("button");

      community.id = this.IDPrefix + "-community-" + this.count++;
      community.className = "community";
      community.style.margin = "10px";
      head.style.display = "flex";
      head.style.gap = "10px";
      box.className = "avatar-box";
      box.style.maxWidth = "30px";
      box.style.maxHeight = "30px";
      image.src = commImg != null ? commImg : this.defaultImage;
      image.alt = "";
      image.style.maxWidth = "30px";
      title.innerText = titleString;
      title.style.marginBlockStart = "0px";
      title.style.marginBlockEnd = "0px";
      let isFollow = await APICalls.getRequests.isFollowing(titleString);
      isFollow = isFollow.response[0];
      follow.innerText = isFollow ? "Unfollow" : "Follow";
      bottom.style.display = "flex";
      open.style.border = "none";
      open.style.margin = "0px";
      open.name = "open-community-" + titleString;
      open.style.backgroundColor = "transparent";
      open.innerText = descString;

      community.appendChild(head);
      box.appendChild(image);
      head.appendChild(box);
      head.appendChild(title);
      head.appendChild(follow);
      bottom.appendChild(open);
      community.appendChild(bottom);

      follow.onclick = async () => {
        if (follow.innerText == "Follow") {
          await APICalls.postRequests.sub(titleString);
          follow.innerText = "Unfollow";
        } else {
          await APICalls.postRequests.unsub(titleString);
          follow.innerText = "Follow";
        }
      };

      if (this.inSearch) {
        open.onclick = async () => {
          sharedCommunityCache = JSONBuilder.build(["title", "desc", "img"], [titleString, descString, commImg]);
          let event = new CustomEvent("community-detail");
          document.dispatchEvent(event);
        }
      } else {
        follow.style.color = "#FFFFFF";
        head.style.justifyContent = "space-evenly";
        open.style.color = "#FFFFFF";
        bottom.style.justifyContent = "center";
      }

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
    let user = document.createElement("h2");
    let date = document.createElement("h3");
    let content = document.createElement("p");
    let userButton = document.createElement("button");
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
    userButton.style.border = "none";
    userButton.style.margin = "0px";
    userButton.name = userString + "-profile";
    userButton.style.backgroundColor = "transparent";
    pfp.src = userPfp != null ? userPfp : this.defaultImage;
    pfp.alt = "";
    pfp.style.maxHeight = "30px";
    
    container.appendChild(comment);
    comment.appendChild(head);
    userButton.appendChild(pfp);
    head.appendChild(userButton);
    head.appendChild(user);
    head.appendChild(date);
    comment.appendChild(content);
    comment.appendChild(buttons);
    
    userButton.onclick = () => openUserPage(userString);

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
          input.style.width = "220px";
          send.type = "button";
          send.value = "Send";
          bar.appendChild(input);
          bar.appendChild(send);
          send.onclick = async () => {
            let username = await APICalls.getRequests.getUserInfo();
            username = username.response;
            await APICalls.postRequests.sendSubcommentRequest(JSONBuilder.build(["date", "content", "username", "id"], ["", input.value, username.username, 0]), id);
            reply.innerText = "Reply";
            container.removeChild(bar);
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
    this.currentPage = 1;
  }
}