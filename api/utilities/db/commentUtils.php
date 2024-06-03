<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    /**
     * Create a Comment from a given target Post ID and a body containing the JSON to generate the Comment
     */
    function createComment($targetPostID, $requestBody, mysqli $database) {
        $commentObj = jsonToComment($requestBody);
        $content = $commentObj->getContent();
        $username = getUsernameByToken($_COOKIE['token'], $database);

        $statement = $database->prepare("INSERT INTO comment VALUES(0, NOW(), ?, ?)");
        $statement->bind_param("ss", $content, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }
        
        $statement = $database->prepare(
            "SELECT CommentID FROM comment WHERE Username=? ORDER BY CommentID DESC LIMIT 1"
        );
        $statement->bind_param("s", $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $commentID = $statement->get_result();
        
        if (mysqli_num_rows($commentID) !== 1) {
            throw getInternalError();
        }
        
        $statement = $database->prepare("INSERT INTO answer VALUES(?, ?)");
        $statement->bind_param("ii", mysqli_fetch_assoc($commentID)["CommentID"], $targetPostID);
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }
    
    /**
     * Modify the Comment with it's updated version contained in form of a JSON inside the request body
     */
    function modifyComment($requestBody, mysqli $database) {
        $commentBody = jsonToComment($requestBody);
        $statement = $database->prepare("UPDATE commenta SET Date = NOW(), Content = ? WHERE CommentID = ?");
        $statement->bind_param(
            "si",
            $commentBody->getContent(),
            $commentBody->getID()
        );
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }
    
    /**
     * Create a Subcomment from a given origin Comment ID and a body containing the JSON to generate the comment
     */
    function createSubcomment($originID, $requestBody, mysqli $database) {
        $commentObj = jsonToComment($requestBody);
        $content = $commentObj->getContent();
        $username = getUsernameByToken($_COOKIE['token'], $database);

        $statement = $database->prepare("INSERT INTO comment VALUES(0, NOW(), ?, ?)");
        $statement->bind_param("ss", $content, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $statement = $database->prepare(
            "SELECT CommentID FROM comment WHERE Username=? ORDER BY CommentID DESC LIMIT 1"
        );
        $statement->bind_param("s", $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $commentID = $statement->get_result();
        
        if (mysqli_num_rows($commentID) !== 1) {
            throw getInternalError();
        }

        $statement = $database->prepare("INSERT INTO subcomment VALUES(?, ?)");
        $statement->bind_param("ii", mysqli_fetch_assoc($commentID)["CommentID"], $originID);
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    /**
     * Returns an array of the Comments in a specified Post given the Post ID,
     * the number of pages and the number of Comments in each page.
     *
     * If Pages or MaxPerPage are = 0, only the first Comment will be showned.
     */
    function getPostComment($targetPostID, $pages, $maxPerPage, mysqli $database) {
        $n = ($pages!=0 && $maxPerPage!=0) ? $pages*$maxPerPage : 1;
        $statement = $database->prepare(
            "SELECT comment.*, COUNT(subcomment.Sub_CommentID) AS replies
            FROM comment LEFT JOIN subcomment on comment.CommentID = subcomment.CommentID
            GROUP BY comment.CommentID HAVING CommentID IN (SELECT CommentID FROM answer WHERE postID = ?)
            ORDER BY comment.Date DESC LIMIT ?"
        );
        $statement->bind_param("ii", $targetPostID, $n);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $comments = $statement->get_result();

        $result = array();
        while($tmp = mysqli_fetch_assoc($comments)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    /**
     * Returns an array of the Subcomments in a specified Comment given the Comment ID,
     * the number of pages and the number of SubComments in each page.
     *
     * If Pages or MaxPerPage are = 0, only the first Subcomment will be showned.
     */
    function getSubComment($targetCommentID, $pages, $maxPerPage, mysqli $database) {
        $n = $pages*$maxPerPage;
        $statement = $database->prepare(
            "SELECT * FROM comment WHERE CommentID IN (
                SELECT Sub_CommentID FROM subcomment WHERE CommentID=?
            ) ORDER BY date DESC LIMIT ?"
        );
        $statement->bind_param("ii", $targetCommentID, $n);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $comments = $statement->get_result();

        $result = array();
        while($tmp = mysqli_fetch_assoc($comments)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    /**
     * Returns the number of Subcomments in a specified Comment given the Comment ID.
     * 
     */
    function getSubCommentAmount($targetCommentID, mysqli $database) {
        $statement = $database->prepare(
            "SELECT COUNT(*) AS count FROM subcomment WHERE CommentID = ?"
        );
        $statement->bind_param("i", $targetCommentID);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $amount = $statement->get_result();

        $result = array();
        while($tmp = mysqli_fetch_assoc($amount)) {
            array_push($result, $tmp);
        }

        return $result;
    }
