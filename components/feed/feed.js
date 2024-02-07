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
    let newPage = await APICalls.getRequests.getPostsRequest("", page, 8);
    newPage = newPage.response;
    for (let i in newPage) {
        mainGlobalVariables.page.mainContentPage.appendChild(
                postBuilder.makePost(newPage[i].title, null, newPage[i].username, newPage[i].name, newPage[i].content, newPage[i].image, newPage[i].postId));
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