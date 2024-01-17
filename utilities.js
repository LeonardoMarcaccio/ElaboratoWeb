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

/*const utilityErrors = {
    CookieError: class CookieError extends Error {
        constructor(message, name) {
            super(message);
            if (name) {
                this.name = "Generic Cookie Error";
            }
        }
    },
    UnexistingCookieError: class UnexistingCookieError extends CookieError {
        constructor(name, cookieName) {
            super(cookieName+" does not exist!", name);
        }
    }
}*/

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

// TODO: Add a common function that checks if param is really a path string.
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

//TODO: expand functionality
const ajaxUtilities = {
    SimpleAjaxRequest: class SimpleAjaxRequest extends XMLHttpRequest {
        constructor(method, url, onSuccess, attempts, onFailure) {
            super();
            this.open(method, url, true);
            if (typeof this.attempts === 'number'
            || typeof this.attempts === 'undefined') {
                this.attempts = attempts
            } else {
                throw new Error("Attempts isNaN!");
            }
            this.onreadystatechange = () => {
                if (this.readyState == 4 && this.status == 200) {
                    onSuccess(this);
                }
            };
            this.onerror = () => onFailure(this);
        }
        fire() {
            this.send();
        }
    }
}
