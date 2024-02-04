class CommunityBuilder {
    count = 0;
    defaultImage = "";
    IDPrefix = "";
    
    constructor (IDPrefix, defaultImage) {
        this.IDPrefix = IDPrefix;
        this.defaultImage = defaultImage;
    }
    
    makeCommunity(titleString, descString, commImg) {
        let community = document.createElement("article");
        let head = document.createElement("div");
        let image = document.createElement("img");
        let title = document.createElement("h1");
        let follow = document.createElement("button");
        let desc = document.createElement("p");
        
        community.id = this.IDPrefix + "-community-" + this.count++;
        community.className = "community";
        community.style.margin = "10px";
        head.style.display = "flex";
        head.style.gap = "10px";
        image.src = commImg != null ? commImg : this.defaultImage;
        title.innerText = titleString;
        title.style.marginBlockStart = "0px";
        title.style.marginBlockEnd = "0px";
        follow.innerText = "Follow";
        desc.innerText = descString;
        
        community.appendChild(head);
        head.appendChild(image);
        head.appendChild(title);
        head.appendChild(follow);
        community.appendChild(desc);
        
        return community;
    }
}

/*
let commBuilder = new CommunityBuilder("search", "https://www.w3schools.com/images/lamp.jpg");
mainGlobalVariables.page.mainContentPage.appendChild(commBuilder.makeCommunity("r/Jontron", "Scott the Woz and Wario Land are peak", null));
*/