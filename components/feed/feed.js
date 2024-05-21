class FeedPage extends DynamicPage {
    async load() {
        super.load();
    
        this.postBuilder = new PostBuilder("feed");
        this.postLoader = new ContentLoader((page) => this.loadPosts(page));
        this.postLoader.loadMore();

        this.bindListeners();
    }

    async loadPosts(page) {
        let newPage = await APICalls.getRequests.getPostsRequest("", page, 8);
        newPage = newPage.response;
        for (let i in newPage) {
            let tmp = postBuilder.makePost(newPage[i].title, null, newPage[i].username, newPage[i].name, newPage[i].content, newPage[i].image, newPage[i].postId);
            mainGlobalVariables.page.mainContentPage.addContent(tmp);
        }
    }

    bindListeners() {
        mainGlobalVariables.page.mainContentPage.addEventListener('scroll', () => {
            if (mainGlobalVariables.currentPageLoc == events.actionBar.home &&
                mainGlobalVariables.page.mainContentPage.innerHeight +
                mainGlobalVariables.page.mainContentPage.scrollY >=
                document.body.offsetHeight) {
                this.postLoader.loadMore();
            }
        });

        document.getElementById("nav-feed").onclick = () => {
            mainHandler.contentHandling.clearBodyContent();
            this.postLoader.reset();
            this.postLoader.loadMore();
        }
    }
}