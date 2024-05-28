class PostPage extends DynamicPage {
    async load() {
        if (!mainGlobalVariables.userData.userLoggedIn) {
            return;
        }
        super.load("/post/post");

        this.user = null;
        this.postContent = null;
        this.postTitle = null;
        this.postImage = null;
        this.communityTitle = null;
        this.communityDesc = null;
        this.communityImage = null;
        this.toggleButtons = null;
        this.togglePost = null;
        this.toggleCommunity = null;
        this.setToggleButtons();

        await this.bindListeners();
    }

    getOptions() {
        return this.lazyNodeIdQuery("communities-options", true);
    }

    getPostDiv() {
        return this.lazyNodeIdQuery("create-post", true);
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

    getCommunityDiv() {
        return this.lazyNodeIdQuery("create-community", true);
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
        return this.lazyNodeIdQuery("post-form", true);
    }

    getCommunityForm() {
        return this.lazyNodeIdQuery("community-form", true);
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

    async imgToJSON(imageFile) {
        let reader = new FileReader();
        let rfile = new Promise((accepted, rejected) => {
          reader.onload = () => {
            accepted(reader.result);
          }
          reader.onerror = () => {
            rejected(new Error("Could not read file!"));
          }
        });
        reader.readAsBinaryString(imageFile);
        let readFile = await rfile;
  
        let encodedProfilePicture = btoa(readFile);
        let profilePictureExtension = imageFile.name.split(".")[1];
  
        return {
            "image":encodedProfilePicture != "" ? encodedProfilePicture : null,
            "format":encodedProfilePicture != "" ? profilePictureExtension : null
        };
    }

    async bindListeners() {
        this.user = await APICalls.getRequests.getUserInfo();
        this.user = this.user.response.username;
        let choices = await APICalls.getRequests.getSubbedCommunitiesRequest(this.user);
        choices = choices.response;
        let select = this.getOptions();
        for (let i in choices) {
            let tmp = document.createElement("option");
            tmp.innerText = choices[i].Name;
            select.appendChild(tmp);
        }
    
        this.getPostForm().onsubmit = async (event) => {
            event.preventDefault();
            this.setPostElements();
            let picture = await this.imgToJSON(this.postImage.files[0]);
            await APICalls.postRequests.sendPostRequest(JSONBuilder.build(["postID", "date", "content", "likes", "title", "postImage", "name", "username"],
            ["", "", this.postContent.value, 0, this.postTitle.value, picture, select.value, this.user]),
            select.value);
        }

        this.getCommunityForm().onsubmit = async (event) => {
            event.preventDefault();
            this.setCommunityElements();
            let picture = await this.imgToJSON(this.communityImage.files[0]);
            await APICalls.postRequests.sendCommunityRequest(JSONBuilder.build(["name", "communityImage", "description"],
            [this.communityTitle.value, picture, this.communityDesc.value]));
        }

        this.togglePost.onclick = () => {
            this.togglePost.disabled = true;
            this.toggleCommunity.disabled = false;
            this.getCommunityDiv().style.display = "none";
            this.getPostDiv().style.display = "flex";
        }

        this.toggleCommunity.onclick = () => {
            this.togglePost.disabled = false;
            this.toggleCommunity.disabled = true;
            this.getPostDiv().style.display = "none";
            this.getCommunityDiv().style.display = "flex";
        }
    }
}

let postClass = new PostPage();

document.addEventListener(events.actionBar.post, () => {
    postClass.load();
});