/*
let commentBuilder = new CommentBuilder("");
let jsonComment = {
    "date":"2024-02-06 18:27:53",
    "content":"This is a sample content for a sample comment",
    "username":"Bomboclatter41",
    "id":"0"
}
*/

async function loadPosts(page) {
    console.log("Entered");
    let tmpCommunity = await APICalls.getRequests.getCommunitiesRequest("", page, 1);
    console.log(tmpCommunity);
    console.log(tmpCommunity[0]);
    let newPage = await APICalls.getRequests.getPostsRequest(tmpCommunity[0].name, page, 8);
    let userPfp = await APICalls.getRequests.getUserInfo(newPage[i].username);
    userPfp = userPfp.pfp;
    for (let i in newPage) {
        mainGlobalVariables.page.mainContentPage.appendChild(
                postBuilder.makePost(newPage[i].title, userPfp, newPage[i].username, newPage[i].name, newPage[i].content, newPage[i].image, newPage[i].postId));
    }
}

document.getElementById("nav-feed").onclick = () => {
    mainPageLoader.flushPage();
    postLoader.reset();
    postLoader.switchLoadMethod((page) => loadPosts(page));
    postLoader.loadMore();
}

postLoader = new ContentLoader((page) => loadPosts(page));
postLoader.loadMore();