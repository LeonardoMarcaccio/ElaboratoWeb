<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

    function createCommunity($requestBody, mysqli $database) {
        $communityBody = jsonToCommunity($requestBody);
        $name = $communityBody->getCommunityName();
        $image = $communityBody->getCommunityImage();
        $description = $communityBody->getCommunityDescription();
        $username = getUsernameByToken($_COOKIE["token"],$database);
        $statement = $database->prepare("INSERT INTO community (Name, Image, Description, Username) VALUES (?, ?, ?, ?)");
        $statement->bind_param(
            "ssss",
            $name,
            $image,
            $description,
            $username
        );
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
    }

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
            throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
    }

    function getCommunities($communityName, $pages, $maxPerPage, mysqli $database) {
        $n = $pages * $maxPerPage;
        $statement = $database->prepare("SELECT * FROM community WHERE name LIKE '%{$communityName}%' LIMIT ?");
        $statement->bind_param("i", $n);
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

    function subCommunity($username, $communityName, mysqli $database) {
        $statement = $database->prepare("INSERT INTO `join`(`Name`, `Username`) VALUES (?,?)");
        $statement->bind_param("ss", $username, $communityName);
        if (!$statement->execute()) {
          throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
    }

    function unsubCommunity($username, $communityName, mysqli $database) {
        $statement = $database->prepare("DELETE FROM `join` WHERE `Name` = ? AND `Username` = ?");
        $statement->bind_param("ss", $username, $communityName);
        if (!$statement->execute()) {
          throw new ApiError("Internal Server Error", 500,
            DB_CONNECTION_ERROR, 500);
        }
    }

