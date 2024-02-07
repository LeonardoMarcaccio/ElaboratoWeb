<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

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
  function getNicknameByToken($token, mysqli $database) {
    $sql = "SELECT Nickname FROM sessione WHERE Token = ?";
    $stmt = $database->prepare($sql);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->bind_result($nickname);
    $stmt->fetch();
    return ($nickname !== null) ? $nickname : false;
  }

  function tokenRefresh ($token, $username, mysqli $database) {
    $statement = $database->prepare("UPDATE session SET Date = NOW() WHERE Token = ? AND CommentID = ?");
    $statement->bind_param(
      "ss",
      $token,
      $username
    );
  }
