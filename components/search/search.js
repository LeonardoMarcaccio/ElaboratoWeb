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

document.getElementById("search-start").onclick = () => {
    mainPageLoader.flushPage();
    communityLoader.reset();
    communityLoader.switchLoadMethod((page) => {
        let newPage = APICalls.getRequests.getCommunitiesRequest(page, 16); // Also document.getElementById("search-keyword").innerText
        for (let i in newPage) {
            mainGlobalVariables.page.mainContentPage.appendChild(
                    communityBuilder.makeCommunity(newPage[i].name, newPage[i].description, newPage[i].image));
        }
    });
    communityLoader.loadMore();
}
