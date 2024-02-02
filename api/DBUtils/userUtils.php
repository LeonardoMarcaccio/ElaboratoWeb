<?php

    function getUser($username, mysqli $database) {
        $query = $database->prepare("SELECT * FROM user WHERE Username=? LIMIT 1");
        $query->bind_param("s", $username);
        if ($query->execute()) {
            $resultingUser = mysqli_fetch_assoc($query->get_result());
            return $resultingUser !== null ? $resultingUser : false;
        }
        throw new ApiError("Internal Server Error", 500,                  //NOSONAR
            DB_CONNECTION_ERROR, 500);
    }

    function areFriends($user1, $user2, mysqli $database) {
        $statement = $database->prepare("SELECT COUNT(*) FROM friendship WHERE (Fri_Username = ? AND Username = ?) OR (Fri_Username = ? AND Username = ?)");
        $statement->bind_param("ssss", $user1, $user2, $user2, $user1);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,                //NOSONAR
              DB_CONNECTION_ERROR, 500);
        }
        $statement->bind_result($count);
        $statement->fetch();
        return $count > 0;
    }

    function checkInfoLevel($queryingUser, $username, mysqli $database) {
        if ($queryingUser == $username) {
          return USER_SELF;
        } else {
          return areFriends($queryingUser, $username, $database)
            ? USER_FRIEND 
            : USER_STRANGER;
        }
    }