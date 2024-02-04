<?php

    function createComment($targetPostID, $requestBody, mysqli $database) {
        $commentObj = jsonToComment($requestBody);
        $content = $commentObj->getContent();
        $username = getUsernameByToken($_COOKIE['token'], $database);

        $statement = $database->prepare("INSERT INTO comment VALUES(NOW(), ?, ?)");
        $statement->bind_param("ss", $content, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
        
        $statement = $database->prepare("SELECT CommentID FROM comment LIMIT 1 WHERE Username=? ORDER BY date DESC");
        $statement->bind_param("s", $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $commentID = $statement->get_result();
        
        if (mysqli_num_rows($commentID) !== 1) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        
        $statement = $database->prepare("INSERT INTO answer VALUES(?, ?)");
        $statement->bind_param("ii", $commentID, $targetPostID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
    }
    
    function modifyComment($requestBody, mysqli $database) {
        $commentBody = jsonToPost($requestBody);
        $statement = $database->prepare("UPDATE post SET Date = NOW(), Content = ?, Image = ? WHERE PostID = ?");
        $statement->bind_param(
            "ssi",
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

        $commentID = $statement->get_result();
        
        if (mysqli_num_rows($commentID) !== 1) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement = $database->prepare("INSERT INTO subcomment VALUES(?, ?)");
        $statement->bind_param("ii", $commentID, $originID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
    }

    function getPostComment($targetPostID, $pages, $maxPerPage, mysqli $database) {
        $n = $pages*$maxPerPage;
        $statement = $database->prepare("SELECT * FROM answer WHERE postID=?");
        $statement->bind_param("i", $targetPostID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $comments = $statement->get_result();
        if (mysqli_num_rows($comments) === 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement = $database->prepare("SELECT * FROM comment LIMIT ? WHERE CommentID IN ? ORDER BY date DESC");
        $statement->bind_param("is", $n, $comments);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $comments = $statement->get_result();
        if (mysqli_num_rows($comments) === 0) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $result = array();
        while($tmp = mysqli_fetch_assoc($comments)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    function getSubComment($targetCommentID, $pages, $maxPerPage, mysqli $database) {
        $n = $pages*$maxPerPage;
        $statement = $database->prepare("SELECT * FROM subcomment WHERE CommentID=?");
        $statement->bind_param("i", $targetCommentID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $comments = $statement->get_result();
        if (mysqli_num_rows($comments) === 0) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement = $database->prepare("SELECT * FROM comment LIMIT ? WHERE CommentID IN ? ORDER BY date DESC");
        $statement->bind_param("is", $n, $comments);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $comments = $statement->get_result();
        if (mysqli_num_rows($comments) === 0) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $result = array();
        while($tmp = mysqli_fetch_assoc($comments)) {
            array_push($result, $tmp);
        }

        return $result;
    }