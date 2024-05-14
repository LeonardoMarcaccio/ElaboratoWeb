async function makeList() {
    const user = await APICalls.getRequests.getUserInfo();
    user = user.response.Username;
    let choices = await APICalls.getRequests.getSubbedCommunitiesRequest(user);
    choices = choices.response;
    let select = document.getElementById("communities-options");
    for (let i in choices) {
        let tmp = document.createElement("option");
        tmp.innerText = choices[i].Name;
        select.appendChild(tmp);
    }

    let postButton = document.getElementById("post-post");
    postButton.onclick = () => {
        APICalls.postRequests.sendPostRequest(JSONBuilder.build(["postID", "date", "content", "likes", "title", "image", "name", "username"],
        ["", "", document.getElementById("post-content").innerText, 0, document.getElementById("post-title").innerText, document.getElementById("post-image").innerText, select.value, user]),
        select.innerText);
    }
}

makeList();