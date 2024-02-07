let commentBuilder = new CommentBuilder("");
let jsonComment = {
    "date":"2024-02-06 18:27:53",
    "content":"This is a sample content for a sample comment",
    "username":"Bomboclatter41",
    "id":"0"
}

postLoader = new ContentLoader((unused) => {
    for (let i=0; i<10; i++) {
        mainGlobalVariables.page.mainContentPage.appendChild(commentBuilder.makeComment(jsonComment.username, jsonComment.content, null, jsonComment.date, jsonComment.id));
    }
});
postLoader.loadMore();

document.getElementById("nav-feed").onclick = () => {
    mainPageLoader.flushPage();
    postLoader.reset();
    postLoader.switchLoadMethod((page) => {
        let tmpCommunity = APICalls.getRequests.getCommunitiesRequest(page, 1);
        let newPage = APICalls.getRequests.getPostsRequest(tmpCommunity[0].name, page, 8);
        let userPfp = APICalls.getRequests.getUserInfo(newPage[i].username);
        userPfp = userPfp.image;
        for (let i in newPage) {
            mainGlobalVariables.page.mainContentPage.appendChild(
                    postBuilder.makePost(newPage[i].title, userPfp, newPage[i].username, newPage[i].name, newPage[i].content, newPage[i].image, newPage[i].postId));
        }
    });
    postLoader.loadMore();
}