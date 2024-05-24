<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    function addVote($username, $postID, $value, mysqli $database) {
        $statement = $database->prepare("SELECT Value FROM vote WHERE PostID=? and Username=?");
        $statement->bind_param("is", $postID, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $oldValue = $statement->get_result();
        if (mysqli_num_rows($oldValue) == 0) {
            newVote($username, $postID, $value, $database);
        } else {
            $tmp = mysqli_fetch_assoc($oldValue)["Value"];
            if ($tmp !== $value) {
                updateVote($username, $postID, $value, $database);
            } else {
                deleteVote($username, $postID, $database);
            }
        }
    }

    function newVote($username, $postID, $value, mysqli $database) {
        $statement = $database->prepare("INSERT INTO vote VALUES(?, ?, ?)");
        $statement->bind_param("isi", $postID, $username, $value);
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    function updateVote($username, $postID, $value, mysqli $database) {
        $statement = $database->prepare("UPDATE vote SET value=? WHERE PostID=? AND Username=?");
        $statement->bind_param("iis", $value, $postID, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    function deleteVote($username, $postID, mysqli $database) {
        $statement = $database->prepare("DELETE FROM vote WHERE PostID=? AND Username=?");
        $statement->bind_param("is", $postID, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    function getVote($username, $postID, mysqli $database) {
        $statement = $database->prepare("SELECT Value FROM vote WHERE PostID=? and Username=?");
        $statement->bind_param("is", $postID, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $oldValue = $statement->get_result();
        if (mysqli_num_rows($oldValue) == 0) {
            return null;
        } else {
            return mysqli_fetch_assoc($oldValue)["Value"];
        }
    }

