<?php

    function addVote($username, $postID, $value, mysqli $database) {
        $statement = $database->prepare("SELECT Value FROM vote WHERE PostID=? and Username=1");
        $statement->bind_param("ss", $postID, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $statement->bind_result($oldValue);
        $statement->fetch();
        if (mysqli_num_rows($oldValue) == 0) {
            newVote($username, $postID, $value, $database);
        } else {
            if ($oldValue !== $value) {
                updateVote($username, $postID, $value, $database);
            } else {
                deleteVote($username, $postID, $database);
            }
        }
    }

    function newVote($username, $postID, $value, mysqli $database) {
        $statement = $database->prepare("INSERT INTO vote VALUES(?, ?, ?)");
        $statement->bind_param("ssi", $postID, $username, $value);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function updateVote($username, $postID, $value, mysqli $database) {
        $statement = $database->prepare("UPDATE vote SET value=? WHERE PostID=? AND Username=?");
        $statement->bind_param("iss", $value, $postID, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function deleteVote($username, $postID, mysqli $database) {
        $statement = $database->prepare("DELETE FROM vote WHERE PostID=? AND Username=?");
        $statement->bind_param("ss", $postID, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

