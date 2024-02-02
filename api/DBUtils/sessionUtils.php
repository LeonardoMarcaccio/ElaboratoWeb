<?php

    function createSession($token, $username, mysqli $database) {
        $statement = $database->prepare("INSERT INTO sessione (Token, Date, Username) VALUES (?, NOW(), ?)");
        $statement->bind_param("ss", $token, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            "Error while contacting database", 500);
        }
    }

    function generateUniqueToken(mysqli $database) {
        $query = $database->prepare("SELECT * FROM sessione WHERE Token = ? LIMIT 1");
        $generatedToken = null;
        
        do {
            $generatedToken = generateToken();
            $query->bind_param("s", $generatedToken);
            if (!$query->execute()) {
            throw new ApiError("Internal Server Error", 500,                //NOSONAR
                DB_CONNECTION_ERROR, 500);
            }
            $result = mysqli_fetch_assoc($query->get_result());
        } while ($result);

        return $generatedToken;
    }

    function updateSession($token, $username, mysqli $database) {
        $statement = $database->prepare("UPDATE sessione SET Date = NOW() WHERE Token = ?");
        $statement->bind_param("ss", $token, $username);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            "Error while contacting database", 500);
        }
    }

    function getUsernameByToken($token, mysqli $database) {
        $statement = $database->prepare("SELECT Username FROM sessione WHERE Token = ?");
        $statement->bind_param("s", $token);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            "Error while contacting database", 500);
        }
        $statement->bind_result($username);
        $statement->fetch();
        return ($username !== null) ? $username : false;
    }

    function deleteOldTokens(mysqli $database, $ttlHours) {
        $timestampLimit = time() - ($ttlHours * 3600);
        $statement = $database->prepare("DELETE FROM sessione WHERE TIMESTAMPDIFF(SECOND, Date, NOW()) > ?");
        $statement->bind_param("i", $timestampLimit);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            "Error while contacting database", 500);
        }
    }

    function checkTokenValidity($token, mysqli $database) {
        deleteOldTokens($database, DEFAULT_TOKEN_TTL);
        $statement = $database->prepare("SELECT Date FROM sessione WHERE Token = ?");
        $statement->bind_param("s", $token);
        if (!$statement->execute()) {
            throw new ApiError("Internal Server Error", 500,
            "Error while contacting database", 500);
        }

        $statement->bind_result($timestamp);
        $statement->fetch();

        if ($timestamp !== null) {
            $passedTime = time() - strtotime($timestamp);
            return $passedTime <= DEFAULT_TOKEN_TTL;
        }

        return false;
    }

    