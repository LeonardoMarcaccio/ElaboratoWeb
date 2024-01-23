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

const documentUtilities = {
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
    addScriptFile: (pathToFile, onLoadFunc) => {
        let scriptTag = document.createElement("script");   //NOSONAR
        scriptTag.src = pathToFile;
        if (onLoadFunc instanceof Function) {
            scriptTag.onload = () => onLoadFunc.call();
        }
        document.body.appendChild(scriptTag);
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
        while (elementToRemove.childElementCount > remaining) {
            elementToRemove.removeChild(elementToRemove.lastChild);
        }
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
