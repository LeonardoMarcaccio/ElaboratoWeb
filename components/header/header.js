class Notification {
  constructor(identifier, title = "", content = "") {
    this.identifier = identifier;
    this.notification = document.createElement("div")
    this.notification.classList.add("header-notification");
    this.clearBtn = document.createElement("button");
    this.clearBtn.type = "button";
    this.clearBtn.innerHTML = "mark as read";
    this.notifTitle = document.createElement("h1");
    this.notifContent = document.createElement("p");
    this.clearBtn = document.createElement("button");
    this.clearBtn.innerHTML = "mark as read";
    this.notification.appendChild(this.notifTitle);
    this.notification.appendChild(this.notifContent);
    this.notification.appendChild(this.clearBtn);
    this.setTitle(title);
    this.setContent(content);
  }
  setTitle(title) {
    this.notifTitle.innerHTML = title;
  }
  setContent(content) {
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
    this.bindActionListeners();
    this.isOpen = false;
    this.notifications = new Map();
  }
  open() {
    this.drawer.style.width = "75vw";
    this.isOpen = true;
  }
  close() {
    this.drawer.style.width = "0";
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
    /*if (this.freeIds.length == 0) {
      selectedId = this.nextNotificationId;
      this.nextNotificationId += 1;
    } else {
      selectedId = this.freeIds.pop();
    }*/
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
  }
  clearNotifications() {
    this.notifications.forEach((index) => {
      this.destroyNotification(index);
    });
  }
  async update() {
    let userNotifications = await APICalls.getRequests.getNotifications();
    if (!userNotifications.hasOwnProperty("response")) {
      return;
    }
    let codeList = new Array();
    userNotifications.response.forEach(
      (value, index) => {
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
  }
}

let drawer = new SlidingDrawer();
drawer.update();

// TODO: Add repeating function for notification check
setInterval(() => drawer.update(), 3000);
