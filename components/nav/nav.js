let navButtons = document.getElementsByClassName("nav-button");

navButtons.array.forEach(btnElement => {
  let eventName = btnElement.id.replace("nav-", "");
  btnElement.onclick = () => {
    let event = new CustomEvent(eventName, {detail: btnElement});
    console.warn("generating new event and firing it");
    document.dispatchEvent(event);
  };
});
