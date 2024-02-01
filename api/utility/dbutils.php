<?php
  define("DEFAULT_TOKEN_TTL",  time() + 36000);

  function checkUserPresence($username, mysqli $database) {
    $query = $database->prepare("SELECT * FROM user WHERE Username=? LIMIT 1");
    $query->bind_param("s", $username);
    if ($query->execute()) {
      $resultingUser = mysqli_fetch_assoc($query->get_result());
      return $resultingUser !== null ? $resultingUser : false;
    }
    throw new ApiError("Internal Server Error", 500,                  //NOSONAR
      DB_CONNECTION_ERROR, 500);
  }

  function checkInfoLevel($queryingUser, $username, mysqli $database) {
    if ($queryingUser == $username) {
      return USER_SELF;
    } else {
      $query = $database->prepare("SELECT * FROM friendship WHERE Username=? AND Fri_Username=? LIMIT 1");
      $query->bind_param("ss", $queryingUser, $username);
      if (!$query->execute()) {
        throw new ApiError("Internal Server Error", 500,                //NOSONAR
          DB_CONNECTION_ERROR, 500);
      }
      $friendshipResult = mysqli_fetch_assoc($query->get_result());
      return $friendshipResult !== null
        ? USER_FRIEND
        : USER_STRANGER;
    }
  }

  function isValueInColumn($table, $columnName, $value, mysqli $database) {
    $stmt = $database->prepare("SELECT COUNT(*) FROM $table WHERE $columnName = ?");
    $stmt->bind_param("s", $value);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    return $count > 0;
  }

  function areUsersFriends($userA, $userB, mysqli $database) {
    $query = $database->prepare("SELECT * FROM friendship WHERE (Fri_Username=? OR Fri_Username=?) AND (Username=? OR Username=?) LIMIT 2");
    $query->bind_param("ssss", $userA, $userB, $userA, $userB);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,                //NOSONAR
        DB_CONNECTION_ERROR, 500);
    }
    $queryResult = $query->get_result();
    $friendshipA = mysqli_fetch_assoc($queryResult);
    $friendshipB = mysqli_fetch_assoc($queryResult);

    return strcmp($friendshipA['Username'], $friendshipB['Username'])
      && strcmp($friendshipA['Fri_Username'], $friendshipB['Fri_Username']);
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
  
  function deleteOldTokens(mysqli $database, $ttlHours) {
    $timestampLimit = time() - ($ttlHours * 3600);
    $sql = "DELETE FROM sessione WHERE TIMESTAMPDIFF(SECOND, Timestamp, NOW()) > ?";
    $stmt = $database->prepare($sql);
    $stmt->bind_param("i", $timestampLimit);
    $stmt->execute();
  }
  function checkTokenValidity($token, $username, mysqli $database) {
    deleteOldTokens($database, DEFAULT_TOKEN_TTL);
    $sql = "SELECT Timestamp FROM sessione WHERE Token = ? AND Username = ?";
    $stmt = $database->prepare($sql);
    $stmt->bind_param("ss", $token, $username);
    $stmt->execute();
    $stmt->bind_result($timestamp);
    $stmt->fetch();

    if ($timestamp !== null) {
        $passedTime = time() - strtotime($timestamp);
        return $passedTime <= DEFAULT_TOKEN_TTL;
    }

    return false;
  }
  function getNicknameByToken($token, mysqli $database) {
    $sql = "SELECT Nickname FROM sessione WHERE Token = ?";
    $stmt = $database->prepare($sql);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->bind_result($nickname);
    $stmt->fetch();
    return ($nickname !== null) ? $nickname : false;
  }
  function areFriends($user1, $user2, mysqli $database) {
    $sql = "SELECT COUNT(*) FROM friendship WHERE (Fri_Username = ? AND Username = ?) OR (Fri_Username = ? AND Username = ?)";
    $stmt = $database->prepare($sql);
    $stmt->bind_param("ssss", $user1, $user2, $user2, $user1);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    return $count > 0;
  }

  function assignTokenToUser($dbUser, $token, mysqli $database) {
    $query = $database->prepare("INSERT INTO Sessione (Token, Username) VALUES (?, ?)");
    $query->bind_param("ss", $dbUser, $token);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,                //NOSONAR
        DB_CONNECTION_ERROR, 500);
    }
  }

  function getRecentPost($n_post, $username, mysqli $database) {
    $query = $database->prepare("SELECT name FROM `Join` WHERE username=?");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,                
        DB_CONNECTION_ERROR, 500);
    }
    
    $communities = $query->get_result();
    
    $query = $database->prepare("SELECT * FROM post LIMIT ? WHERE name IN ? ORDER BY date DESC");
    $query->bind_param("is", $n_post, $communities);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,                
        DB_CONNECTION_ERROR, 500);
    }

    return $query->get_result();
  }

  function tokenRefresh ($token, $username, mysqli $database) {
    $statement = $database->prepare("UPDATE session SET Date = NOW() WHERE Token = ? AND CommentID = ?");
    $statement->bind_param(
      "ss",
      $token,
      $username
    );
  }
