<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    function createPost($targetCommunity, $requestBody, mysqli $database) {
        $postObj = jsonToPost($requestBody);
        $content = $postObj->getContent();
        $title = $postObj->getTitle();
        $image = $postObj->getImageUrl();
        $username = getUsernameByToken($_COOKIE['token'], $database);

        $statement = $database->prepare("INSERT INTO post VALUES(0, NOW(), ?, 0, ?, ?, ?, ?)");
        $statement->bind_param("sssss", $content, $title, $image, $targetCommunity, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function modifyPost($requestBody, mysqli $database) {
        $postBody = jsonToPost($requestBody);
        $statement = $database->prepare("UPDATE post SET Date = NOW(), Content = ? WHERE PostID = ?");
        $statement->bind_param(
            "si",
            $postBody->getContent(),
            $postBody->getID()
        );

        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function getRecentPost($n_post, $username, mysqli $database) {
        $statement = $database->prepare("SELECT * FROM post WHERE Name IN (SELECT name FROM `Join` WHERE Username=?) ORDER BY date DESC LIMIT ?");
        $statement->bind_param("si",$username, $n_post);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $posts = $statement->get_result();
        if (mysqli_num_rows($posts) === 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        
        $result = array();
        while($tmp = mysqli_fetch_assoc($posts)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    function getCommunityPost($targetCommunityName, $pages, $maxPerPage, mysqli $database) {
        $n = ($pages + 1)*$maxPerPage;
        $statement = $database->prepare(
            "SELECT post.*, COUNT(answer.CommentID) AS replies
            FROM post LEFT JOIN answer ON post.PostID = answer.PostID
            GROUP BY post.PostID HAVING post.Name = ? ORDER BY `post`.`Date` DESC LIMIT ?"
        );
        $statement->bind_param("si", $targetCommunityName, $n);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $posts = $statement->get_result();
        if (mysqli_num_rows($posts) == 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        
        $result = array();
        while($tmp = mysqli_fetch_assoc($posts)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    function updateLikes ($postID, mysqli $database) {
        $statement = $database->prepare("SELECT COUNT(*) AS value FROM vote WHERE PostID=? and Value=1");
        $statement->bind_param("s", $postID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $likes = $statement->get_result();
        if (mysqli_num_rows($likes) === 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement = $database->prepare("SELECT COUNT(*) AS value FROM vote WHERE PostID=? and Value=0");
        $statement->bind_param("s", $postID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $dislikes = $statement->get_result();
        if (mysqli_num_rows($dislikes) === 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $newValue = mysqli_fetch_assoc($likes)["value"] - mysqli_fetch_assoc($dislikes)["value"];

        $statement = $database->prepare("UPDATE post SET Likes=? WHERE PostID=?");
        $statement->bind_param("is", $newValue, $postID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function getPost($postID, mysqli $database) {
        $statement = $database->prepare("SELECT * FROM post WHERE PostID=?");
        $statement->bind_param("s", $postID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $post = $statement->get_result();
        if (mysqli_num_rows($post) !== 1) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        return mysqli_fetch_assoc($post);
    }