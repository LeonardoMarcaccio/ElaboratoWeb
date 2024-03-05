let navButtons = document.getElementsByClassName("nav-button");

for (let btnElement of navButtons) {
  let eventName = btnElement.id.replace("nav-", "");
  btnElement.onclick = () => {
    let event = new CustomEvent(eventName, {detail: btnElement});
    document.dispatchEvent(event);
  };
};
