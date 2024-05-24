<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    function notifyMessage($from, $to, $code, mysqli $database) {
        // Prepare the SQL statement with the correct number of placeholders
        $statement = $database->prepare("INSERT INTO notification (Username, code, message) VALUES (?, ?, CONCAT('You received one new message from ', ?))");
        $statement->bind_param("sss", $to, $code, $from);
    
        // Execute the statement and check for errors
        if (!$statement->execute()) {
            throw new Exception("Database error: " . $statement->error);
        }
    
        // Close the statement
        $statement->close();
    }
    

    function notifyPost($community, $code, mysqli $database) {
        $statement = $database->prepare("SELECT Username FROM `join` WHERE Name = ?");
        $statement->bind_param("s", $community);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $statement->bind_result($users);
        $statement->fetch();
        if (mysqli_num_rows($users) == 0) {
            throw getInternalError();
        }

        $username = mysqli_fetch_assoc($users);
        while($username !== null) {
            $statement = $database->prepare("INSERT INTO notification VALUES(?, ?, A new post was published in ?");
            $statement->bind_param("sss", $username, $code, $community);
            if (!$statement->execute()) {
                throw getInternalError();
            }
        }
    }

    function destroyNotification($username, $code, mysqli $database) {
        // Prepare the SQL statement with the correct number of placeholders
        $statement = $database->prepare("DELETE FROM notification WHERE Username = ? AND Code = ?)");
        $statement->bind_param("ss", $username, $code);
    
        // Execute the statement and check for errors
        if (!$statement->execute()) {
            throw new Exception("Database error: " . $statement->error);
        }
    
        // Close the statement
        $statement->close();
    }

    function getUserNotification($username, mysqli $database) {
        // Prepare the SQL statement with the correct number of placeholders
        $statement = $database->prepare("SELECT notification WHERE Username = ?)");
        $statement->bind_param("s", $username);
    
        // Execute the statement and check for errors
        if (!$statement->execute()) {
            throw new Exception("Database error: " . $statement->error);
        }

        $posts = $statement->get_result();
        if (mysqli_num_rows($posts) === 0) {
            throw getInternalError();
        }

        // Close the statement
        $statement->close();
        
        $result = array();
        while($tmp = mysqli_fetch_assoc($posts)) {
            array_push($result, $tmp);
        }
        
        return $result;
    }
    