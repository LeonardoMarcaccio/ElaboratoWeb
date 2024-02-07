/*
let communityBuilder = new CommunityBuilder("search");
let jsonCommunity = {
    "name":"Sample Name",
    "description":"This is a sample description for a sample community",
    "image":null
}
*/

async function loadCommunities(page) {
    let newPage = await APICalls.getRequests.getCommunitiesRequest(document.getElementById("search-keyword").innerText, page, 16);
    for (let i in newPage) {
        mainGlobalVariables.page.mainContentPage.appendChild(
                communityBuilder.makeCommunity(newPage[i].name, newPage[i].description, newPage[i].image));
    }
}

document.getElementById("search-start").onclick = () => {
    mainPageLoader.flushPage();
    communityLoader.reset();
    communityLoader.switchLoadMethod((page) => loadCommunities(page));
    communityLoader.loadMore();
}

communityLoader = new ContentLoader((page) => loadCommunities(page));