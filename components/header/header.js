class Notification {
  constructor(identifier, title = "", content = "") {
    this.identifier = identifier;
    this.notifTitle = null;
    this.notifContent = null;
    this.notification = document.createElement("div")
    this.notification.classList.add("header-notification");
    this.clearBtn = document.createElement("button");
    this.clearBtn.type = "button";
    this.clearBtn.name = "header-drawer-notification-dismiss";
    this.clearBtn.innerHTML = "mark as read";
    if (title != "") {
    }
    if (content == "") {
    }
    this.clearBtn = document.createElement("button");
    this.clearBtn.innerHTML = "mark as read";
    this.notification.appendChild(this.clearBtn);
    this.setTitle(title);
    this.setContent(content);
  }
  setTitle(title) {
    if (this.notifTitle!= null && (title == null || title == "")) {
      this.notification.removeChild(this.notifTitle);
      this.notifTitle = null;
      return;
    }
    if (this.notifTitle == null) {
      this.notifTitle = document.createElement("h1");
      if (this.notifContent != null) {
        this.notification.insertBefore(this.notifTitle, this.notifContent);
      } else {
        this.notification.insertBefore(this.notifTitle, this.clearBtn);
      }
    }
    this.notifTitle.innerHTML = title;
  }
  setContent(content) {
    if (this.notifContent!= null && (content == null || content == "")) {
      this.notification.removeChild(this.notifContent);
      this.notifContent = null;
      return;
    }
    if (this.notifContent == null) {
      this.notifContent = document.createElement("p");
      if (this.notifTitle != null) {
        this.notification.insertBefore(this.notifContent, this.clearBtn);
      } else {
        this.notification.insertBefore(this.notifContent, this.notifTitle);
      }
    }
    this.notifContent.innerHTML = content;
  }
  setClearAction(clearAction) {
    this.clearBtn.onclick = clearAction;
  }
  getNotification() {
    return this.notification;
  }
  getIdentifier() {
    return this.identifier;
  }
}

class SlidingDrawer {
  constructor() {
    this.nextNotificationId = 0;
    this.freeIds = new Array();
    this.drawer = document.getElementById("header-drawer");
    this.drawerBtn = document.getElementById("header-drawer-btn");
    this.drawerCloseBtn = document.getElementById("header-drawer-close-btn");
    this.drawerBody = document.getElementById("header-drawer-body-scrollcontainer");
    this.notificationCounter = document.getElementById("header-drawer-notification-counter");
    this.bindActionListeners();
    this.isOpen = false;
    this.notifications = new Map();
  }
  open() {
    if (this.isOpen) {
      return;
    }
    this.drawer.classList.add("header-drawer-open");
    this.drawer.classList.remove("header-drawer-close");
    this.isOpen = true;
  }
  close() {
    if (!this.isOpen) {
      return;
    }
    this.drawer.classList.add("header-drawer-close");
    this.drawer.classList.remove("header-drawer-open");
    this.isOpen = false;
  }
  bindActionListeners() {
    let toggleFunc = () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    };
    this.drawerBtn.onclick = toggleFunc;
    this.drawerCloseBtn.onclick = toggleFunc;
  }
  createNotification(code, title = "", content = "") {
    if (this.notifications.has(code)) {
      this.notifications.get(code).setTitle(title);
      this.notifications.get(code).setContent(content);
      return;
    }
    let notification = new Notification(code, title, content);
    let selectedId = code;
    this.notifications.set(selectedId, notification);
    notification.setClearAction(() => {
      APICalls.postRequests.sendRemoveNotification(selectedId);
      this.destroyNotification(selectedId);
    });
    this.drawerBody.appendChild(notification.getNotification());
    return code;
  }
  destroyNotification(notificationNumber) {
    this.drawerBody.removeChild(this.notifications.get(notificationNumber).getNotification());
    this.freeIds.push(notificationNumber);
    this.notifications.delete(notificationNumber);
    this.update();
  }
  clearNotifications() {
    this.notifications.forEach((index) => {
      this.destroyNotification(index);
    });
  }
  updateNotificationCounter(number) {
    this.notificationCounter.innerHTML = number;
  }
  async update() {
    if (!mainGlobalVariables.userData.userLoggedIn) {
      return;
    }
    let userNotifications = await APICalls.getRequests.getNotifications();
    if (!userNotifications.hasOwnProperty("response")) {
      this.notificationCounter.innerHTML = "";
      return;
    }
    let codeList = new Array();
    let size = 0;
    userNotifications.response.forEach(
      (value, index) => {
        size += 1;
        codeList.push(value);
        this.createNotification(value.code, "", value.text);
      }
    );
    let enqueuedDeletion = new Array();
    this.notifications.forEach((value, key) => {
      if (codeList.find((code) => code == key) === 'undefined') {
        enqueuedDeletion.push(key);
      }
    });
    enqueuedDeletion.forEach((value, index) => {
      this.notifications.delete(value);
    });
    this.notificationCounter.innerHTML = size > 0
      ? size
      : "";
  }
}

let drawer = new SlidingDrawer();
drawer.update();

setInterval(() => drawer.update(), 3000);
