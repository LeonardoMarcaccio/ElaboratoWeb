<?php

    function createCommunity($requestBody, mysqli $database) {
        $communityBody = jsonToCommunity($requestBody);
        $statement = $database->prepare("INSERT INTO community (Name, Image, Description, Username) VALUES (?, ?, ?, ?)");
        $statement->bind_param(
            "ssss",
            $communityBody->getCommunityName(),
            $communityBody->getCommunityImage(),
            $communityBody->getCommunityDescription(),
            getUsernameByToken($_COOKIE["token"],$database)
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

    function getCommunities($username, $pages, $maxPerPage, mysqli $database) {
        $n = $pages * $maxPerPage;
        $statement = $database->prepare("SELECT * FROM community LIMIT ? WHERE name=?");
        $statement->bind_param("is", $n, $username);
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