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