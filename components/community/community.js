let sharedCommunityCache = null;

class CommunityPage extends DynamicPage {
    async load() {
        await super.load("/community/community");

        this.communityBuilder = new CommunityBuilder("community", false);
        this.communityDiv = this.getCommunityDiv();
        this.setCommunityPage();

        this.bindListeners();
    }

    getCommunityDiv() {
        return this.lazyNodeIdQuery("community-div", true);
    }

    async setCommunityPage() {
        let head = await this.communityBuilder.makeCommunity(
            sharedCommunityCache.title,
            sharedCommunityCache.desc,
            sharedCommunityCache.img,
        );
        mainGlobalVariables.page.mainContentHeading.addContent(head);
        let posts = await APICalls.getRequests.getPostsRequest(sharedCommunityCache.title, 1, 10);
        posts = posts.response;
        let builder = new PostBuilder("search");
        for (let i in posts) {
            posts[i];
            let tmp = await builder.makePost(posts[i].title, null, posts[i].username, posts[i].name, posts[i].content, posts[i].image, posts[i].id, posts[i].likes);
            this.communityDiv.appendChild(tmp);
        }
    }

    bindListeners() {
    }

}

let communityClass = new CommunityPage();

document.addEventListener("community-detail", () => {
    communityClass.load();
});
