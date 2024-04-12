/*
let commentBuilder = new CommentBuilder("");
let jsonComment = {
    "date":"2024-02-06 18:27:53",
    "content":"This is a sample content for a sample comment",
    "username":"Bomboclatter41",
    "id":"0"
}
*/

let postBuilder = new PostBuilder("feed");

async function loadPosts(page) {
    //  Works when logged in
    let newPage = await APICalls.getRequests.getPostsRequest("", page, 8);
    newPage = newPage.response;
    for (let i in newPage) {
        let tmp = postBuilder.makePost(newPage[i].title, null, newPage[i].username, newPage[i].name, newPage[i].content, newPage[i].image, newPage[i].postId);
        mainGlobalVariables.page.mainContentPage.addContent(tmp);
    }
}

let postLoader = new ContentLoader((page) => loadPosts(page));

document.getElementById("nav-feed").onclick = () => {
    mainHandler.contentHandling.clearBodyContent();
    postLoader.reset();
    postLoader.loadMore();
}

postLoader.loadMore();