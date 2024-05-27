class PostPage extends DynamicPage {
    async load() {
        if (!mainGlobalVariables.userData.userLoggedIn) {
            return;
        }
        super.load("/post/post");

        this.user = null;
        this.postButton = null;
        this.postContent = null;
        this.postTitle = null;
        this.postImage = null;
        this.toggleButtons = null;
        this.togglePost = null;
        this.toggleCommunity = null;
        this.setToggleButtons();

        await this.bindListeners();
    }

    getOptions() {
        return this.lazyNodeIdQuery("communities-options", true);
    }

    getPostButton() {
        return this.lazyNodeIdQuery("post-post", true);
    }

    getPostContent() {
        return this.lazyNodeIdQuery("post-content", true);
    }

    getPostTitle() {
        return this.lazyNodeIdQuery("post-title", true);
    }

    getPostImage() {
        return this.lazyNodeIdQuery("post-image", true);
    }

    getCommunityButton() {
        return this.lazyNodeIdQuery("community-create", true);
    }

    getCommunityTitle() {
        return this.lazyNodeIdQuery("community-title", true);
    }

    getCommunityDesc() {
        return this.lazyNodeIdQuery("community-desc", true);
    }

    getCommunityImage() {
        return this.lazyNodeIdQuery("community-image", true);
    }

    getPostForm() {
        return this.lazyNodeIdQuery("create-post", true);
    }

    getCommunityForm() {
        return this.lazyNodeIdQuery("create-community", true);
    }

    setToggleButtons() {
        this.toggleButtons = document.createElement("div");
        this.togglePost = document.createElement("button");
        this.toggleCommunity = document.createElement("button");
        this.toggleButtons.style.backgroundColor = "#E0DFD5";
        this.toggleButtons.style.display = "flex";
        this.toggleButtons.style.justifyContent = "center";
        this.togglePost.textContent = "Create Post";
        this.togglePost.disabled = true;
        this.toggleCommunity.textContent = "Create Community";
        this.toggleCommunity.disabled = false;
        this.toggleButtons.appendChild(this.togglePost);
        this.toggleButtons.appendChild(this.toggleCommunity);
        mainGlobalVariables.page.mainContentHeading.addContent(this.toggleButtons);
    }

    setPostElements() {
        this.postContent = this.getPostContent();
        this.postTitle = this.getPostTitle();
        this.postImage = this.getPostImage();
    }

    setCommunityElements() {
        this.communityTitle = this.getCommunityTitle();
        this.communityDesc = this.getCommunityDesc();
        this.communityImage = this.getCommunityImage();
    }

    async bindListeners() {
        this.user = await APICalls.getRequests.getUserInfo();
        this.user = this.user.response;
        let choices = await APICalls.getRequests.getSubbedCommunitiesRequest(this.user.username);
        choices = choices.response;
        let select = this.getOptions();
        for (let i in choices) {
            let tmp = document.createElement("option");
            tmp.innerText = choices[i].Name;
            select.appendChild(tmp);
        }
    
        this.getPostButton().onclick = async () => {
            this.setPostElements();
            await APICalls.postRequests.sendPostRequest(JSONBuilder.build(["postID", "date", "content", "likes", "title", "image", "name", "username"],
            ["", "", this.postContent.innerText, 0, this.postTitle.innerText, this.postImage.innerText, select.value, user]),
            select.innerText);
        }

        this.getCommunityButton().onclick = async () => {
            this.setCommunityElements();
            await APICalls.postRequests.sendCommunityRequest(JSONBuilder.build(["Name", "Image", "Description", "Username"],
            [this.communityTitle.innerText, this.communityImage.innerText, this.communityDesc.innerText, user]));
        }

        this.togglePost.onclick = () => {
            this.togglePost.disabled = true;
            this.toggleCommunity.disabled = false;
            this.getCommunityForm().style.display = "none";
            this.getPostForm().style.display = "flex";
        }

        this.toggleCommunity.onclick = () => {
            this.togglePost.disabled = false;
            this.toggleCommunity.disabled = true;
            this.getPostForm().style.display = "none";
            this.getCommunityForm().style.display = "flex";
        }
    }
}

let postClass = new PostPage();

document.addEventListener(events.actionBar.post, () => {
    postClass.load();
});