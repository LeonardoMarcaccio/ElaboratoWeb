<?php

    function createComment($postID, $content, $username, mysqli $database) {
        $statement = $database->prepare("INSERT INTO comment VALUES(NOW(), ?, ?)");
        $statement->bind_param("ss", $content, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        
        $statement = $database->prepare("SELECT commentID FROM comment LIMIT 1 WHERE username=? ORDER BY date DESC");
        $statement->bind_param("s", $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        
        $statement->bind_result($commentID);
        $statement->fetch();
        if (mysqli_num_rows($commentID) == 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        
        $statement = $database->prepare("INSERT INTO answer VALUES(?, ?)");
        $statement->bind_param("ss", $commentID, $postID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }
    
    function modifyComment($requestBody, mysqli $database) {
        $commentBody = jsonToPost($requestBody);
        $statement = $database->prepare("UPDATE post SET Date = NOW(), Content = ?, Image = ? WHERE PostID = ?");
        $statement->bind_param(
            "sss",
            $commentBody->getContent(),
            $commentBody->getImageUrl(),
            $commentBody->getID()
        );
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                //NOSONAR
              DB_CONNECTION_ERROR, 500);
        }
    }
    
    function createSubcomment($originID, $content, $username, mysqli $database) {
        $statement = $database->prepare("INSERT INTO community VALUES(NOW(), ?, ?)");
        $statement->bind_param("ss", $content, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement = $database->prepare("SELECT commentID FROM comment LIMIT 1 WHERE username=? ORDER BY date DESC");
        $statement->bind_param("s", $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement->bind_result($commentID);
        $statement->fetch();
        if (mysqli_num_rows($commentID) == 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement = $database->prepare("INSERT INTO subcomment VALUES(?, ?)");
        $statement->bind_param("ss", $commentID, $originID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function getPostComment($targetPostID, $requestBody, $pages, $maxPerPage, mysqli $database) {
        $n = $pages*$maxPerPage;
        $statement = $database->prepare("SELECT * FROM answer LIMIT ? WHERE postID=? ORDER BY date DESC");
        $statement->bind_param("is", $n, $targetPostID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement->bind_result($comments);
        $statement->fetch();
        if (mysqli_num_rows($comments) == 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        return $comments;
    }
