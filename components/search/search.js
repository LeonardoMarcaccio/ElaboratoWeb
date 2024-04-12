/*
let communityBuilder = new CommunityBuilder("search");
let jsonCommunity = {
    "name":"Sample Name",
    "description":"This is a sample description for a sample community",
    "image":null
}
*/

const communityBuilder = new CommunityBuilder("search");

async function loadCommunities(page) {
    let newPage = await APICalls.getRequests.getCommunitiesRequest(document.getElementById("search-keyword").value, page, 16);
    newPage = newPage.response;
    console.log(newPage);
    for (let i in newPage) {
        console.log(newPage[i].Name);
        let tmp = await communityBuilder.makeCommunity(newPage[i].Name, newPage[i].Description, newPage[i].Image);
        mainGlobalVariables.page.mainContentPage.addContent(tmp);
    }
}

let communityLoader = new ContentLoader((page) => loadCommunities(page));

document.getElementById("search-start").onclick = () => {
    mainHandler.contentHandling.clearBodyContent();
    communityLoader.reset();
    communityLoader.loadMore();
}