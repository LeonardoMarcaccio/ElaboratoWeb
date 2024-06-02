if (cookieUtilities.readCookie("consent") == "") {
  document.getElementById("cookie-banner").style.display = "block";
}

document.getElementById("cookie-banner-consent-btn").onclick = () => {
  document.getElementById("cookie-banner").style.display = "none";
  cookieUtilities.addCookie("consent", "ok", 999999, "/", "Strict");
}
