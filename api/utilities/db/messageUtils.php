<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/userUtils.php";  //NOSONAR
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/notify.php";  //NOSONAR

    /**
     * Send a message to the specified User
     */
    function createMessage($friendUsername, $content, mysqli $database) {
        $message = jsonToMessage($content);
        $username = getUsernameByToken($_COOKIE['token'], $database);
        $statement = $database->prepare("INSERT INTO message VALUES(?, ?, NOW(), ?)");
        $statement->bind_param("sss", $username, $friendUsername, $message);
        if (!$statement->execute()) {
            throw getInternalError();
        }
        notifyMessage($username, $friendUsername, com_create_guid(), $database);
    }

    /**
     * Return the chat between two users
     */
    function getChat($friendUsername, $pages, $maxPerPage, mysqli $database) {
        $username = getUsernameByToken($_COOKIE['token'], $database);
        $n = $pages * $maxPerPage;
        $statement = $database->prepare(
            "SELECT * FROM message
            WHERE ( message.Username = ? AND message.Fri_Username = ?)
            OR (message.Username = ? AND message.Fri_Username = ?)
            ORDER BY message.Timestamp DESC LIMIT ?");
        $statement->bind_param("ssssi", $username, $friendUsername, $friendUsername, $username, $n);
        if (!$statement->execute()) {
            throw getInternalError();
        }
        
        $communities = $statement->get_result();
        if (mysqli_num_rows($communities) === 0) {
            throw getInternalError();
        }
        
        $result = array();
        while($tmp = mysqli_fetch_assoc($communities)) {
            array_push($result, $tmp);
        }
        return $result;
    }
