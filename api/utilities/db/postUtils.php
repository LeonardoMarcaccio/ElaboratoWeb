<?php

    function createPost($content, $title, $image, $communityName, $username, mysqli $database) {
        $statement = $database->prepare("INSERT INTO community VALUES(NOW(), ?, ?, ?, ?, ?)");
        $statement->bind_param("sssss", $content, $title, $image, $communityName, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function modifyPost($requestBody, mysqli $database) {
        $commentBody = jsonToComment($requestBody);
        $statement = $database->prepare("UPDATE comment SET Date = NOW(), Content = ? WHERE CommentID = ?");
        $statement->bind_param(
            "ss",
            $commentBody->getContent(),
            $commentBody->getID()
        );
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function getRecentPost($n_post, $username, mysqli $database) {
        $statement = $database->prepare("SELECT name FROM `Join` WHERE username=?");
        $statement->bind_param("s", $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $communities = $statement->get_result();

        $statement = $database->prepare("SELECT * FROM post LIMIT ? WHERE name IN ? ORDER BY date DESC");
        $statement->bind_param("is", $n_post, $communities);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        $statement->bind_result($recentPost);
        $statement->fetch();
        return ($recentPost !== null) ? $recentPost : false;
    }

    function getCommunityPost($targetCommunityName, $pages, $maxPerPage, mysqli $database) {
        $n = $pages*$maxPerPage;
        $statement = $database->prepare("SELECT * FROM post LIMIT ? WHERE name=? ORDER BY date DESC");
        $statement->bind_param("is", $n, $targetCommunityName);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement->bind_result($posts);
        $statement->fetch();
        if (mysqli_num_rows($posts) == 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        return $posts;
    }

    function updateLikes ($postID, mysqli $database) {
        $statement = $database->prepare("SELECT COUNT(*) FROM message WHERE PostID=? and Value=1");
        $statement->bind_param("s", $postID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement->bind_result($likes);
        $statement->fetch();
        if (mysqli_num_rows($likes) == 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement = $database->prepare("SELECT COUNT(*) FROM message WHERE PostID=? and Value=0");
        $statement->bind_param("s", $postID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement->bind_result($dislikes);
        $statement->fetch();
        if (mysqli_num_rows($dislikes) == 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $newValue = $likes - $dislikes;

        $statement = $database->prepare("UPDATE post SET Likes=? WHERE PostID=?");
        $statement->bind_param("is", $newValue, $postID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }