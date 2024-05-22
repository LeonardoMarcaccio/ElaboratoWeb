class PostPage extends DynamicPage {
    async load() {
        super.load("/post/post");

        this.user = null;
        this.postButton = null;
        this.postContent = null;
        this.postTitle = null;
        this.postImage = null;

        await this.makeList();
    }

    getOptions() {
        return this.lazyNodeIdQuery("communities-options");
    }

    getPostButton() {
        return this.lazyNodeIdQuery("post-post");
    }

    getPostContent() {
        return this.lazyNodeIdQuery("post-content");
    }

    getPostTitle() {
        return this.lazyNodeIdQuery("post-title");
    }

    getPostImage() {
        return this.lazyNodeIdQuery("post-image");
    }

    checkElements() {
        this.postContent = this.postContent == null ? this.getPostContent() : this.postContent;
        this.postTitle = this.postTitle == null ? this.getPostTitle() : this.postTitle;
        this.postContent = this.postImage == null ? this.getPostImage() : this.postImage;
    }

    async makeList() {
        this.user = this.user == null ? await APICalls.getRequests.getUserInfo() : this.user;
        this.user = this.user.response.Username;
        let choices = await APICalls.getRequests.getSubbedCommunitiesRequest(this.user);
        choices = choices.response;
        let select = this.getOptions();
        for (let i in choices) {
            let tmp = document.createElement("option");
            tmp.innerText = choices[i].Name;
            select.appendChild(tmp);
        }
    
        this.postButton = this.postButton == null ? this.getPostButton() : this.postButton;
        this.postButton.onclick = async () => {
            this.checkElements();
            await APICalls.postRequests.sendPostRequest(JSONBuilder.build(["postID", "date", "content", "likes", "title", "image", "name", "username"],
            ["", "", this.postContent.innerText, 0, this.postTitle.innerText,this.postImage.innerText, select.value, user]),
            select.innerText);
        }
    }
}

let postClass = new PostPage();

document.addEventListener(events.actionBar.post, () => {
    mainHandler.contentHandling.purgePageContent();
    postClass.load();
});