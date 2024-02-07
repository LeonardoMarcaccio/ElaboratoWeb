/*
let communityBuilder = new CommunityBuilder("search");
let jsonCommunity = {
    "name":"Sample Name",
    "description":"This is a sample description for a sample community",
    "image":null
}
*/

let communityBuilder = new CommunityBuilder("search");

async function loadCommunities(page) {
    let newPage = await APICalls.getRequests.getCommunitiesRequest(document.getElementById("search-keyword").value, page, 16);
    newPage = newPage.response;
    console.log(newPage);
    for (let i in newPage) {
        mainGlobalVariables.page.mainContentPage.appendChild(
                communityBuilder.makeCommunity(newPage[i].Name, newPage[i].Description, newPage[i].Image));
    }
}

document.getElementById("search-start").onclick = () => {
    mainPageLoader.flushPage();
    communityLoader.reset();
    communityLoader.switchLoadMethod((page) => loadCommunities(page));
    communityLoader.loadMore();
}

communityLoader = new ContentLoader((page) => loadCommunities(page));