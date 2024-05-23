<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    function notifyMessage($from, $to, $chatLink, mysqli $database) {
        // Prepare the SQL statement with the correct number of placeholders
        $statement = $database->prepare("INSERT INTO notification (recipient, chat_link, message) VALUES (?, ?, CONCAT('You received one new message from ', ?))");
        $statement->bind_param("sss", $to, $chatLink, $from);
    
        // Execute the statement and check for errors
        if (!$statement->execute()) {
            throw new Exception("Database error: " . $statement->error);
        }
    
        // Close the statement
        $statement->close();
    }
    

    function notifyPost($community, $postLink, mysqli $database) {
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
            $statement->bind_param("sss", $username, $postLink, $community);
            if (!$statement->execute()) {
                throw getInternalError();
            }
        }
    }

    function notifyRegistration($token, mysqli $database) {
        $statement = $database->prepare("SELECT Username FROM sessione WHERE Token = ?");
        $statement->bind_param("s", $token);
        if (!$statement->execute()) {
            throw new Exception('Internal error executing query.');
        }
        
        $result = $statement->get_result();
        if ($result->num_rows == 0) {
            throw new Exception('No user found for the provided token.');
        }
        
        $row = $result->fetch_assoc();
        $username = $row['Username'];
        
        $statement->close();

        $statement = $database->prepare("SELECT Email FROM user WHERE Username = ?");
        $statement->bind_param("s", $username);
        if (!$statement->execute()) {
            throw new Exception('Internal error executing query.');
        }
    
        $result = $statement->get_result();
        if ($result->num_rows == 0) {
            throw new Exception('No email found for the provided username.');
        }
    
        while ($row = $result->fetch_assoc()) {
            $userMail = $row['Email'];
            mail($userMail, "New Post", "Welcome to PlayPal " . $username, "From: PlayPal@gmail.com");
        }
        
        $statement->close();
    }
    
