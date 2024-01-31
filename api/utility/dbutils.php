<?php
  define("DB_CONNECTION_ERROR", "Error while contacting database");

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

  function checkTokenValidity($token, mysqli $database) {
    $query = $database->prepare("INSERT INTO Sessione (Token, Username) VALUES (?, ?)");
    $query->bind_param("ss", $dbUser, $token);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,                //NOSONAR
        DB_CONNECTION_ERROR, 500);
    }
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
