<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/data/notification.php";   //NOSONAR

    function notifyMessage($from, $to, $code, mysqli $database) {
        // Prepare the SQL statement with the correct number of placeholders
        $statement = $database->prepare("INSERT INTO notification (Username, Code, Text) VALUES (?, ?, ?)");
        $message = "You received one new message from ".$from;
        $statement->bind_param("sss", $to, $code, $message);
    
        // Execute the statement and check for errors
        if (!$statement->execute()) {
            throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE);
        }
    }

    function notifyFriendshipRequest($from, $to, $code, mysqli $database) {
        // Prepare the SQL statement with the correct number of placeholders
        $statement = $database->prepare("INSERT INTO notification (Username, Code, Text) VALUES (?, ?, ?)");
        $message = $from." sent you a friend request";
        $statement->bind_param("sss", $to, $code, $message);
    
        // Execute the statement and check for errors
        if (!$statement->execute()) {
            throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE);
        }
    }

    function notifyPost($community, $code, mysqli $database) {
        $statement = $database->prepare("SELECT Username FROM `join` WHERE Name = ?");
        $statement->bind_param("s", $community);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $users = $statement->get_result();

        while($username = mysqli_fetch_assoc($users)) {
            $statement = $database->prepare("INSERT INTO notification (Username, Code, Text) VALUES(?, ?, ?)");
            $message = "A new post was published in ".$community;
            $statement->bind_param("sss", $username["Username"], $code, $message);
            if (!$statement->execute()) {
                throw getInternalError();
            }
        }
    }

    function destroyNotification($code, mysqli $database) {
        // Prepare the SQL statement with the correct number of placeholders
        $statement = $database->prepare("DELETE FROM notification WHERE Code = ?");
        $statement->bind_param("s", $code);
    
        // Execute the statement and check for errors
        if (!$statement->execute()) {
            throw new Exception("Database error: " . $statement->error);
        }
    
        // Close the statement
        $statement->close();
    }

    function getUserNotification($username, mysqli $database) {
        // Prepare the SQL statement with the correct number of placeholders
        $statement = $database->prepare("SELECT * FROM notification WHERE Username = ?");
        $statement->bind_param("s", $username);
    
        // Execute the statement and check for errors
        if (!$statement->execute()) {
            throw new Exception("Database error: " . $statement->error);
        }

        $posts = $statement->get_result();

        // Close the statement
        $statement->close();
        
        $result = array();
        while($tmp = mysqli_fetch_assoc($posts)) {
            array_push(
                $result,
                new Notification(
                    $tmp["Username"],
                    $tmp["Code"],
                    $tmp["Text"]
                )
            );
        }
        
        return $result;
    }