class FeedPage extends DynamicPage {
    constructor() {
        super();
        this.pageId = events.actionBar.home;
    }

    async load() {
        if (!mainGlobalVariables.userData.userLoggedIn) {
            return;
        }
        if (mainGlobalVariables.buttonData.lastSelection != "home") {
            mainGlobalVariables.buttonData.lastSelection = "home";
            history.pushState({location: events.actionBar.home}, null, "home");
        }
        await super.load("/feed/feed");
        mainGlobalVariables.page.currentPageLoc = this.pageId;
        mainHandler.contentHandling.clearBodyContent();
        if (this.opts.cache && this.cached) {
            mainHandler.contentHandling.purgePageContent();
        }
    
        this.feedDiv = null;
        this.setFeedDiv();
        this.postBuilder = new PostBuilder("feed");
        this.postLoader = new ContentLoader((page) => this.loadPosts(page));
        this.postLoader.loadMore();

        this.bindListeners();
    }

    setFeedDiv() {
        this.feedDiv = document.createElement("div");
        this.feedDiv.className = "generic-pane";
        this.feedDiv.style.justifyContent = "start";
        mainGlobalVariables.page.mainContentPage.addContent(this.feedDiv);
    }

    getNavFeed() {
        return this.lazyNodeIdQuery("nav-feed");
    }

    async loadPosts(page) {
        let newPage = await APICalls.getRequests.getPostsRequest("", page, 8);
        newPage = newPage.response;
        if (newPage != undefined) {
            for (let i in newPage) {
                let tmp = await this.postBuilder.makePost(newPage[i].title, null, newPage[i].username, newPage[i].name, newPage[i].content, newPage[i].imageUrl, newPage[i].id, newPage[i].likes);
                this.feedDiv.appendChild(tmp);
            }
        } else {
            let errMess = document.createElement("p");
            errMess.textContent = "Looks like you're not following any community at the moment...";
            this.feedDiv.appendChild(errMess);
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
    }
}

let feedClass = new FeedPage();

document.addEventListener(events.actionBar.home, () => {
    feedClass.load();
});

document.addEventListener(events.apiActions.authSuccess, () => {
    feedClass.load();
});