class FeedPage extends DynamicPage {
    async load() {
        await super.load("/feed/feed");
        mainHandler.contentHandling.clearBodyContent();
        if (this.opts.cache && this.cached) {
            mainHandler.contentHandling.purgePageContent();
        }
    
        this.postBuilder = new PostBuilder("feed");
        this.postLoader = new ContentLoader((page) => this.loadPosts(page));
        this.postLoader.loadMore();

        this.bindListeners();
    }

    getNavFeed() {
        return this.lazyNodeIdQuery("nav-feed");
    }

    async loadPosts(page) {
        let newPage = await APICalls.getRequests.getPostsRequest("", page, 8);
        newPage = newPage.response;
        for (let i in newPage) {
            let tmp = this.postBuilder.makePost(newPage[i].title, null, newPage[i].username, newPage[i].name, newPage[i].content, newPage[i].image, newPage[i].id);
            mainGlobalVariables.page.mainContentPage.addContent(tmp);
        }
    }

    bindListeners() {
        mainGlobalVariables.page.mainContentPage.getContent().addEventListener('scroll', () => {
            if (mainGlobalVariables.currentPageLoc == events.actionBar.home &&
                mainGlobalVariables.page.mainContentPage.innerHeight +
                mainGlobalVariables.page.mainContentPage.scrollY >=
                document.body.offsetHeight) {
                this.postLoader.loadMore();
            }
        });

        this.getNavFeed().onclick = () => {
            mainHandler.contentHandling.clearBodyContent();
            this.postLoader.reset();
            this.postLoader.loadMore();
        };
    }
}

let feedClass = new FeedPage();

document.addEventListener(events.actionBar.home, () => {
    mainHandler.contentHandling.purgePageContent();
    feedClass.load();
});
document.addEventListener(events.apiActions.authSuccess, () => {
    mainHandler.contentHandling.purgePageContent();
    feedClass.load();
});