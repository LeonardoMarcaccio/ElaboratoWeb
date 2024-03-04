<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    /**
     * Create a Community from a JSON body containing the data for the Community
     */
    function createCommunity($requestBody, mysqli $database) {
        $communityBody = jsonToCommunity($requestBody);
        $name = $communityBody->getCommunityName();
        $image = $communityBody->getCommunityImage();
        $description = $communityBody->getCommunityDescription();
        $username = getUsernameByToken($_COOKIE["token"],$database);
        $statement = $database->prepare(
            "INSERT INTO community (Name, Image, Description, Username) VALUES (?, ?, ?, ?)"
        );
        $statement->bind_param(
            "ssss",
            $name,
            $image,
            $description,
            $username
        );
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    /**
     * Modify a Community from a JSON body containing the data for the Community
     */
    function modifyCommunity($requestBody, mysqli $database) {
        $communityBody = jsonToCommunity($requestBody);
        $statement = $database->prepare("UPDATE community SET Image = ?, Description = ? WHERE Name = ?");
        $statement->bind_param(
            "sss",
            $communityBody->getCommunityImage(),
            $communityBody->getCommunityDescription(),
            $communityBody->getCommunityName()
        );

        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    /**
     * Returns an array of the Communities containing the Community Name given,
     * the number of pages and the number of Communities in each page.
     *
     * If Pages or MaxPerPage are = 0, only the first Community will be showed.
     */
    function getCommunities($communityName, $pages, $maxPerPage, mysqli $database) {
        $n = ($pages!=0 && $maxPerPage!=0) ? $pages*$maxPerPage : 1;
        $statement = $database->prepare("SELECT * FROM community WHERE name LIKE '%{$communityName}%' LIMIT ?");
        $statement->bind_param("i", $n);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $result = array();
        $communities = $statement->get_result();
        if (mysqli_num_rows($communities) === 0) {
            return $result;
        }

        while($tmp = mysqli_fetch_assoc($communities)) {
            array_push($result, $tmp);
        }

        return $result;
    }

    /**
     * Sub a User to the specified Community
     */
    function subCommunity($username, $communityName, mysqli $database) {
        var_dump($username);
        var_dump($communityName);
        $statement = $database->prepare("INSERT INTO `join`(`Name`, `Username`) VALUES (?,?)");
        $statement->bind_param("ss", $communityName, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }
    }

    /**
     * Check if a User is subbed to a Community
     */
    function isSub($username, $communityName, mysqli $database) {
        $statement = $database->prepare("SELECT * FROM `join` WHERE `Name` = ? AND `Username` = ?");
        $statement->bind_param("ss", $communityName, $username);
        if (!$statement->execute()) {
            throw getInternalError();
        }

        $communities = $statement->get_result();
        if (mysqli_num_rows($communities) === 0) {
            return false;
        }

        return true;
    }

    /**
     * Unsub the user from the specified Community
     */
    function unsubCommunity($username, $communityName, mysqli $database) {
        $statement = $database->prepare("DELETE FROM `join` WHERE `Name` = ? AND `Username` = ?");
        $statement->bind_param("ss", $communityName, $username);
        if (!$statement->execute()) {
          throw getInternalError();
        }
    }

