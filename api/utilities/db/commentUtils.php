<?php

    function createComment($targetPostID, $requestBody, mysqli $database) {
        $commentObj = jsonToComment($requestBody);
        $content = $commentObj->getContent();
        $username = getUsernameByToken($_COOKIE['token'], $database);

        $statement = $database->prepare("INSERT INTO comment VALUES(0, NOW(), ?, ?)");
        $statement->bind_param("ss", $content, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
        
        $statement = $database->prepare("SELECT CommentID FROM comment WHERE Username=? ORDER BY CommentID DESC LIMIT 1");
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
        $statement->bind_param("ii", mysqli_fetch_assoc($commentID)["CommentID"], $targetPostID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
    }
    
    function modifyComment($requestBody, mysqli $database) {
        $commentBody = jsonToComment($requestBody);
        $statement = $database->prepare("UPDATE commenta SET Date = NOW(), Content = ? WHERE CommentID = ?");
        $statement->bind_param(
            "si",
            $commentBody->getContent(),
            $commentBody->getID()
        );
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                //NOSONAR
              DB_CONNECTION_ERROR, 500);
        }
    }
    
    function createSubcomment($originID, $requestBody, mysqli $database) {
        $commentObj = jsonToComment($requestBody);
        $content = $commentObj->getContent();
        $username = getUsernameByToken($_COOKIE['token'], $database);

        $statement = $database->prepare("INSERT INTO comment VALUES(0, NOW(), ?, ?)");
        $statement->bind_param("ss", $content, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $statement = $database->prepare("SELECT CommentID FROM comment WHERE Username=? ORDER BY CommentID DESC LIMIT 1");
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
        $statement->bind_param("ii", mysqli_fetch_assoc($commentID)["CommentID"], $originID);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
    }

    function getPostComment($targetPostID, $pages, $maxPerPage, mysqli $database) {
        $n = $pages*$maxPerPage;
        $statement = $database->prepare(
            "SELECT comment.*, COUNT(subcomment.Sub_CommentID) AS replies
            FROM comment LEFT JOIN subcomment on comment.CommentID = subcomment.CommentID
            GROUP BY comment.CommentID HAVING CommentID IN (SELECT CommentID FROM answer WHERE postID = 2)
            ORDER BY comment.Date DESC LIMIT 10"
        );
        $statement->bind_param("ii", $targetPostID, $n);
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
        $statement = $database->prepare("SELECT * FROM comment WHERE CommentID IN (SELECT CommentID FROM subcomment WHERE CommentID=?) ORDER BY date DESC LIMIT ?");
        $statement->bind_param("ii", $targetCommentID, $n);
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