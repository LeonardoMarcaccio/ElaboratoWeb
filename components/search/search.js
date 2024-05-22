class SearchPage extends DynamicPage {
    async load() {
        await super.load("/search/search");

        this.searchBar = null;
        this.searchButton = null;

        this.communityBuilder = new CommunityBuilder("search");
        this.communityLoader = new ContentLoader((page) => this.loadCommunities(page));
        this.bindListeners();
    }

    getSearchBar() {
        return this.lazyNodeIdQuery("search-keyword");
    }

    getSearchButton() {
        return this.lazyNodeIdQuery("search-start");
    }

    async loadCommunities(page) {
        let newPage = await APICalls.getRequests.getCommunitiesRequest(this.getSearchBar().value, page, 16);
        newPage = newPage.response;
        for (let i in newPage) {
            let tmp = await this.communityBuilder.makeCommunity(newPage[i].Name, newPage[i].Description, newPage[i].Image);
            mainGlobalVariables.page.mainContentPage.addContent(tmp);
        }
    }

    bindListeners() {
        this.getSearchButton().onclick = () => {
            this.communityLoader.reset();
            this.communityLoader.loadMore();
        }
    }
}

let searchClass = new SearchPage();

document.addEventListener(events.actionBar.search, () => {
    mainHandler.contentHandling.purgePageContent();
    searchClass.load();
});