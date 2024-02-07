let communityBuilder = new CommunityBuilder("search");
let jsonCommunity = {
    "name":"Sample Name",
    "description":"This is a sample description for a sample community",
    "image":null
}

communityLoader = new ContentLoader((unused) => {
    for (let i=0; i<14; i++) {
        mainGlobalVariables.page.mainContentPage.appendChild(communityBuilder.makeCommunity(jsonCommunity.name, jsonCommunity.description, jsonCommunity.image));
    }
});
communityLoader.loadMore();