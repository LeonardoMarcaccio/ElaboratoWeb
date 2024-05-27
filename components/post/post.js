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

        await this.makeList();
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

    setElements() {
        this.postContent = this.getPostContent();
        this.postTitle = this.getPostTitle();
        this.postContent = this.getPostImage();
    }

    async makeList() {
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
            this.setElements();
            await APICalls.postRequests.sendPostRequest(JSONBuilder.build(["postID", "date", "content", "likes", "title", "image", "name", "username"],
            ["", "", this.postContent.innerText, 0, this.postTitle.innerText, this.postImage.innerText, select.value, user]),
            select.innerText);
        }
    }
}

let postClass = new PostPage();

document.addEventListener(events.actionBar.post, () => {
    postClass.load();
});