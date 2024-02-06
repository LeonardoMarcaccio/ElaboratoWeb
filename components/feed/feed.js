/*
let postBuilder = new PostBuilder("feed");
mainGlobalVariables.page.mainContentPage.appendChild(postBuilder.makePost("Wario Land 3 is peak", null, "User_1", "r/Jontron", "something something Scott the Woz", null));
mainGlobalVariables.page.mainContentPage.appendChild(postBuilder.makePost("Wario Land 4 is peaker", null, "User_2", "r/Jontron2", "something something Scott Pilgrim", null));


*/

/*
let jsonPage = APICalls.postRequests.sendCommunityRequest();
console.log(jsonPage);
*/

let commentBuilder = new CommentBuilder("");
let jsonComment = {
    "date":"2024-02-06 18:27:53",
    "content":"This is a sample content for a sample comment",
    "username":"Bomboclatter41",
    "id":"0"
}
mainGlobalVariables.page.mainContentPage.appendChild(commentBuilder.makeComment(jsonComment.username, jsonComment.content, null, jsonComment.date, 3, jsonComment.id));