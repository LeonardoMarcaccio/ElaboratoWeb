class PostBuilder {
    count = 0;
    defaultPfp = "";
    IDPrefix = "";

    constructor (IDPrefix, defaultPfp) {
        this.IDPrefix = IDPrefix;
        this.defaultPfp = defaultPfp;
    }

    makePost (titleString, userPfp, userString, srcCommunityString, paragraphString, postImg) {
        let post = document.createElement("article");
        let head = document.createElement("div");
        let userImage = document.createElement("img");
        let title = document.createElement("h1");
        let srcCommunity = document.createElement("h2");
        let paragraph = document.createElement("p");
        let buttons = document.createElement("nav");
        let like = document.createElement("button");
        let dislike = document.createElement("button");
        let comment = document.createElement("button");
        

        post.id = this.IDPrefix + "-post-" + this.count++;
        post.className = "post";
        post.style.margin = "10px";
        head.style.display = "flex";
        head.style.gap = "10px";
        userImage.src = userPfp != null ? userPfp : this.defaultPfp;
        title.innerText = titleString;
        title.style.marginBlockStart = "0px";
        title.style.marginBlockEnd = "0px";
        srcCommunity.innerText = "by " + userString + ", from " + srcCommunityString;
        srcCommunity.style.fontSize = "80%";
        paragraph.innerText = paragraphString;
        like.innerText = "Like";
        dislike.innerText = "Dislike";
        comment.innerText = "Comment";

        post.appendChild(head);
        head.appendChild(userImage);
        head.appendChild(title);
        post.appendChild(srcCommunity);
        if (postImg != null) {
            let postImage = document.createElement("img");
            postImage.src = postImg;
            post.appendChild(postImage);
        }
        post.appendChild(paragraph);
        post.appendChild(buttons);
        buttons.appendChild(like);
        buttons.appendChild(dislike);
        buttons.appendChild(comment);
        
        return post;
    }
}

/*
let postBuilder = new PostBuilder("feed", "https://www.w3schools.com/images/lamp.jpg");
mainGlobalVariables.page.mainContentPage.appendChild(postBuilder.makePost("Wario Land 3 is peak", null, "User_1", "r/Jontron", "something something Scott the Woz", null));
mainGlobalVariables.page.mainContentPage.appendChild(postBuilder.makePost("Wario Land 4 is peaker", null, "User_2", "r/Jontron2", "something something Scott Pilgrim", null));
*/

/*
async function test(url) {
    let tmp = await fetch(url);
    return tmp.json();
}


let url = new URL("content/community.php", document.URL);

url.searchParams.append("type","community");
url.searchParams.append("pageIndex", 0);
url.searchParams.append("pageSize", 6);

console.log(test(url));
*/