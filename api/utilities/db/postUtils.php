<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    /**
     * Create a new Post in the targeted Community
     */
    function createPost($targetCommunity, $requestBody, mysqli $database) {
        $postObj = jsonToPost($requestBody);
        $content = $postObj->getContent();
        $title = $postObj->getTitle();
        $image = $postObj->getImageUrl();
        $username = getUsernameByToken($_COOKIE['token'], $database);

        $statement = $database->prepare("INSERT INTO post VALUES(0, NOW(), ?, 0, ?, ?, ?, ?)");
        $statement->bind_param("sssss", $content, $title, $image, $targetCommunity, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    /**
     * Modify the chosen Post
     */
    function modifyPost($requestBody, mysqli $database) {
        $postBody = jsonToPost($requestBody);
        $statement = $database->prepare("UPDATE post SET Date = NOW(), Content = ? WHERE PostID = ?");
        $statement->bind_param(
            "si",
            $postBody->getContent(),
            $postBody->getID()
        );

        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    /**
     * Return the most recent n Post made by the user
     */
    function getRecentPost($n_post, $username, mysqli $database) {
        $statement = $database->prepare(
            "SELECT * FROM post WHERE Name IN (SELECT name FROM `Join` WHERE Username=?) ORDER BY date DESC LIMIT ?"
        );
        $statement->bind_param("si",$username, $n_post);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $posts = $statement->get_result();
        if (mysqli_num_rows($posts) === 0) {
            throw getInternalError();
        }
        
        $result = array();
        while($tmp = mysqli_fetch_assoc($posts)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    /**
     * Returns an array of the Posts contained in the given Community, having a size based on
     * the number of pages and the number of Post in each page.
     *
     * If Pages or MaxPerPage are = 0, only the first Post will be showned.
     */
    function getCommunityPost($targetCommunityName, $pages, $maxPerPage, mysqli $database) {
        $n = ($pages!=0 && $maxPerPage!=0) ? $pages*$maxPerPage : 1;
        $statement = $database->prepare(
            "SELECT post.*, COUNT(answer.CommentID) AS replies
            FROM post LEFT JOIN answer ON post.PostID = answer.PostID
            GROUP BY post.PostID HAVING post.Name = ? ORDER BY `post`.`Date` DESC LIMIT ?"
        );
        $statement->bind_param("si", $targetCommunityName, $n);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $posts = $statement->get_result();
        if (mysqli_num_rows($posts) == 0) {
            throw getInternalError();
        }
        
        $result = array();
        while($tmp = mysqli_fetch_assoc($posts)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    /**
     * Update the likes in a Post
     */
    function updateLikes ($postID, mysqli $database) {
        $statement = $database->prepare("SELECT COUNT(*) AS value FROM vote WHERE PostID=? and Value=1");
        $statement->bind_param("s", $postID);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $likes = $statement->get_result();
        if (mysqli_num_rows($likes) === 0) {
            throw getInternalError();
        }

        $statement = $database->prepare("SELECT COUNT(*) AS value FROM vote WHERE PostID=? and Value=0");
        $statement->bind_param("s", $postID);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $dislikes = $statement->get_result();
        if (mysqli_num_rows($dislikes) === 0) {
            throw getInternalError();
        }

        $newValue = mysqli_fetch_assoc($likes)["value"] - mysqli_fetch_assoc($dislikes)["value"];

        $statement = $database->prepare("UPDATE post SET Likes=? WHERE PostID=?");
        $statement->bind_param("is", $newValue, $postID);
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    /**
     * Return a specific Post
     */
    function getPost($postID, mysqli $database) {
        $statement = $database->prepare("SELECT * FROM post WHERE PostID=?");
        $statement->bind_param("s", $postID);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $post = $statement->get_result();
        if (mysqli_num_rows($post) !== 1) {
            throw getInternalError();
        }

        return mysqli_fetch_assoc($post);
    }
