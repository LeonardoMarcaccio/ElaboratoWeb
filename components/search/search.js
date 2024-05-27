class SearchPage extends DynamicPage {
    async load() {
        if (!mainGlobalVariables.userData.userLoggedIn) {
            return;
        }
        if (mainGlobalVariables.buttonData.lastSelection != "search") {
            mainGlobalVariables.buttonData.lastSelection = "search";
            history.pushState({location: events.actionBar.search}, null, "search");
        }
        await super.load("/search/search");

        this.searchBar = null;
        this.searchButton = null;
        this.searchDiv = null;

        this.communityBuilder = new CommunityBuilder("search");
        this.communityLoader = new ContentLoader((page) => this.loadCommunities(page));
        this.bindListeners();
    }

    getSearchDiv() {
        return this.lazyNodeIdQuery("search-div", true);
    }

    getSearchBar() {
        return this.lazyNodeIdQuery("search-keyword", true);
    }

    getSearchButton() {
        return this.lazyNodeIdQuery("search-start", true);
    }

    getSearchForm() {
        return this.lazyNodeIdQuery("search-form", true);
    }

    async loadCommunities(page) {
        this.searchDiv = this.getSearchDiv();
        let newPage = await APICalls.getRequests.getCommunitiesRequest(this.getSearchBar().value, page, 16);
        newPage = newPage.response;
        for (let i in newPage) {
            let tmp = await this.communityBuilder.makeCommunity(newPage[i].Name, newPage[i].Description, newPage[i].Image);
            this.searchDiv.appendChild(tmp);
        }
        this.searchDiv.style.maxHeight = 70 + newPage.length * 80 + "px";
    }

    bindListeners() {
        this.getSearchForm().onsubmit = (event) => {
            event.preventDefault();
            this.searchDiv = this.getSearchDiv();
            while (this.searchDiv.children.length > 1) {
                this.searchDiv.removeChild(this.searchDiv.lastChild);
            }
            this.communityLoader.reset();
            this.communityLoader.loadMore();
        }
    }
}

let searchClass = new SearchPage();

document.addEventListener(events.actionBar.search, () => {
    searchClass.load();
});