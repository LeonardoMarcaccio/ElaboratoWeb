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
