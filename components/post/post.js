let choices = APICalls.getRequests.getCommunitiesRequest(0,5);
let select = document.getElementById("communities-options");
for (let i in choices) {
    let tmp = document.createElement("option");
    tmp.value = choices[i].name;
    datalist.appendChild(tmp);
}
let postButton = document.getElementById("post-post");
postButton.onclick = () => {
    APICalls.postRequests.sendPostRequest(JSONBuilder.build(["postID", "date", "content", "likes", "title", "image", "name", "username"],
            ["", "", document.getElementById("post-content").innerText, 0, document.getElementById("post-title").innerText, document.getElementById("post-image").innerText, select.value, APICalls.getRequest.getUser()]));
}