<?php

    function createMessage($username, $friendUsername, $content, mysqli $database) {
        $statement = $database->prepare("INSERT INTO message VALUES(?, ?, NOW(), ?)");
        $statement->bind_param("sss", $username, $friendUsername, $content);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
    }

    function getChat($username, $friendUsername, $pages, $maxPerPage, mysqli $database) {
        $n = $pages * $maxPerPage;
        $statement = $database->prepare(
            "SELECT * FROM message
            WHERE (message.Username = ?  AND message.Fri_Username = ?) OR (message.Username = ? AND message.Fri_Username = ?)
            ORDER BY message.Timestamp DESC LIMIT ?");
        $statement->bind_param("ssssi", $username, $friendUsername, $friendUsername, $username, $n);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

        $communities = $statement->get_result();
        if (mysqli_num_rows($communities) === 0) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }

        $result = array();
        while($tmp = mysqli_fetch_assoc($communities)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    