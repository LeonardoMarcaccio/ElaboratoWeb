<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    function notifyMessage ($to, mysqli $database) {
        $statement = $database->prepare("SELECT Email FROM user WHERE Username = ?");
        $statement->bind_param("s", $to);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $statement->bind_result($mail);
        $statement->fetch();
        if (mysqli_num_rows($mail) == 0) {
            throw getInternalError();
        }

        mail($mail, "New Message", "You received one new message");
    }

    function notifyPost($community, mysqli $database) {
        $statement = $database->prepare("SELECT Username FROM user WHERE Name = ?");
        $statement->bind_param("s", $community);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $statement->bind_result($users);
        $statement->fetch();
        if (mysqli_num_rows($users) == 0) {
            throw getInternalError();
        }

        $userMail = mysqli_fetch_assoc($users);
        while($userMail !== null) {
            mail($userMail, "New Post", "A new post was published in ".$community);
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
    
