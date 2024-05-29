class Notification {
  constructor(title = "", content = "") {
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
  createNotification(title = "", content = "") {
    let notification = new Notification(title, content);
    let selectedId;
    if (this.freeIds.length == 0) {
      selectedId = this.nextNotificationId;
      this.nextNotificationId += 1;
    } else {
      selectedId = this.freeIds.pop();
    }
    this.notifications.set(selectedId, notification);
    notification.setClearAction(() => {
      this.destroyNotification(selectedId);
    });
    this.drawerBody.appendChild(notification.getNotification());
    return this.notifications.length;
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
}

let drawer = new SlidingDrawer();
