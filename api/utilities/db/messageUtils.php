<?php

    function createMessage($username, $friendUsername, $content, mysqli $database) {
        $statement = $database->prepare("INSERT INTO message VALUES(?, ?, NOW(), ?)");
        $statement->bind_param("sss", $username, $friendUsername, $content);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    