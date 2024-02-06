let communityBuilder = new CommunityBuilder("search");
let jsonCommunity = {
    "name":"Sample Name",
    "description":"This is a sample description for a sample community",
    "image":null
}
mainGlobalVariables.page.mainContentPage.appendChild(communityBuilder.makeCommunity(jsonCommunity.name, jsonCommunity.description, jsonCommunity.image));