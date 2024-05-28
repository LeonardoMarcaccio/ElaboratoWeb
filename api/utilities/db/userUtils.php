<?php
  define("PASSWORD_UPDATE_ERROR_CODE", 401);
  define("PASSWORD_UPDATE_ERROR", "An error as occured during password update");
  define("PASSWORD_CHECK_ERROR_CODE", 401);
  define("PASSWORD_CHECK_ERROR", "Wrong password was sent");

  require_once "generalUtils.php";                                    //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

  function getUser($username, mysqli $database) {
    $query = $database->prepare("SELECT * FROM user WHERE Username=? LIMIT 1");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw getInternalError();
    }
    
    $resultingUser = mysqli_fetch_assoc($query->get_result());
    if ($resultingUser === null) {
      return $resultingUser;
    } else {
      return new UserData(
        $resultingUser['Username'],
        $resultingUser['Email'],
        $resultingUser['Password'],
        $resultingUser['FirstName'],
        $resultingUser['LastName'],
        $resultingUser['Gender'],
        $resultingUser['Biography'],
        $resultingUser['PersonalWebsite'],
        $resultingUser['Pfp'],
        $resultingUser['Phonenumbers']);
    }
  }

  function getFriendList($username, mysqli $database) {
    $friends = getFriendNames($username, $database);
    $completeFriendList = array();
    foreach ($friends as $singleFriend) {
      array_push($completeFriendList,
        filterInfoLevel(getUser($singleFriend, $database), USER_FRIEND));
    }
    return $completeFriendList;
  }

  function getFriendNames($username, mysqli $database) {
    $query = $database->prepare("SELECT Fri_Username FROM friendship WHERE Username=? LIMIT 1");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw getInternalError();
    }
    /*  Unused variables
    $friendsArray = array();
    $resultingUser = mysqli_fetch_assoc($query->get_result());
    */
    /*  This is the code that broke
    while ($resultingUser != null) {
      var_dump($resultingUser);
      array_push($resultingUser);
      $resultingUser = mysqli_fetch_assoc($query->get_result());
    }
    return $friendsArray;
    */
    return mysqli_fetch_assoc($query->get_result());;
  }

  function areFriends($queryingUser, $queriedUser, mysqli $database) {
    return monodirectionalFriendshipCheck($queryingUser, $queriedUser, $database)
      && monodirectionalFriendshipCheck($queriedUser, $queryingUser, $database);    //NOSONAR
  }

  function monodirectionalFriendshipCheck($queryingUser, $queriedUser, mysqli $database) {
    $statement = $database->prepare("SELECT COUNT(*) AS val FROM friendship WHERE Fri_Username = ? AND Username = ?");
    $statement->bind_param("ss", $queriedUser, $queryingUser);
    if (!$statement->execute()) {
      throw getInternalError();
    }
    
    $count = $statement->get_result();
    if (mysqli_num_rows($count) === 0) {
      throw getInternalError();
    }

    $sol = mysqli_fetch_assoc($count);
    return $sol["val"] > 0;
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

  function addFriend($friendingUser, $friendedUser, mysqli $database) {
    $query = $database->prepare("INSERT INTO friendship (Fri_Username, Username) VALUES (?, ?)");
    $query->bind_param("ss", $friendedUser, $friendingUser);
    if (!$query->execute()) {
      throw getInternalError();
    }
  }

  function removeFriend($friendingUser, $friendedUser, mysqli $database) {
    $query = $database->prepare("DELETE FROM friendship WHERE Fri_Username = ? AND Username = ?");
    $query->bind_param("ss", $friendedUser, $friendingUser);
    if (!$query->execute()) {
      throw getInternalError();
    }
  }

  function updateUser($requestBody, mysqli $database) {
    $userObj = jsonToRegistration($requestBody);
    $dbNames = [
        'Email' => $userObj->getEmail(),
        'FirstName' => $userObj->getFirstName(),
        'LastName' => $userObj->getLastName(),
        'Gender' => $userObj->getGender(),
        'Biography' => $userObj->getBiography(),
        'PersonalWebsite' => $userObj->getPersonalWebsite(),
        'Pfp' => $userObj->getPfp(),
        'Phonenumbers' => $userObj->getPhoneNumbers(),
    ];

    $target = getUsernameByToken($_COOKIE['token'], $database);
    $queryString = "UPDATE user SET ";

    foreach ($dbNames as $dbEntry => $dbValue) {
        $queryString .= " ".$dbEntry." = ?,";
    }
    $queryString = rtrim($queryString, ',');

    $preparedQuery = $database->prepare($queryString." WHERE Username = ?");
    if ($preparedQuery === false) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE);
    }

    $dbValues = array_values($dbNames);
    $dbValues[] = $target;

    $types = str_repeat('s', count($dbValues));

    $preparedQuery->bind_param($types, ...$dbValues);

    if (!$preparedQuery->execute()) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE);
    }
  }

  function getLoggedUser($username, $password, mysqli $database) {
    $query = $database->prepare("SELECT * FROM user WHERE Username=? LIMIT 1");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw getInternalError();
    }
    
    $resultingUser = mysqli_fetch_assoc($query->get_result());
    if ($resultingUser === null) {
      return $resultingUser;
    } elseif (password_verify($password, attemptValExtraction($resultingUser, 'Password'))) {
      return new UserData(
        $resultingUser['Username'],
        $resultingUser['Email'],
        $resultingUser['Password'],
        $resultingUser['FirstName'],
        $resultingUser['LastName'],
        $resultingUser['Gender'],
        $resultingUser['Biography'],
        $resultingUser['PersonalWebsite'],
        $resultingUser['Pfp'],
        $resultingUser['Phonenumbers']);
    } else {
      throw new ApiError(HTTP_UNAUTHORIZED_ERROR, HTTP_UNAUTHORIZED_ERROR_CODE);
    }
  }

  function testPassword($requestBody, mysqli $database) {
    $data = json_decode($requestBody);
    $toCheck = $data["password"];
    $username = getUsernameByToken($_COOKIE, $database);
    
    $query = $database->prepare("SELECT Password FROM user WHERE Username=?");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw getInternalError();
    }
    $password = mysqli_fetch_assoc($query->get_result());
    if (!password_verify($toCheck, $password)) {
      throw new ApiError(PASSWORD_CHECK_ERROR, PASSWORD_CHECK_ERROR_CODE);
    }
  }

  function passwordUpdate($requestBody, mysqli $database) {
    $data = json_decode($requestBody);
    $oldPassword = $data["oldPassword"];
    $newPassword = $data["newPassword"];
    $username = getUsernameByToken($_COOKIE, $database);
    $query = $database->prepare("SELECT Password FROM user WHERE Username=?");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw getInternalError();
    }

    $password = mysqli_fetch_assoc($query->get_result());
    if (password_verify($oldPassword, $password)) {
      $query = $database->prepare("UPDATE user SET Password=? WHERE Username=?");
      $query->bind_param("ss", password_hash($newPassword, PASSWORD_DEFAULT), $username);
      if (!$query->execute()) {
        throw getInternalError();
      }
    } else {
      throw new ApiError(PASSWORD_UPDATE_ERROR, PASSWORD_UPDATE_ERROR_CODE);
    }
  }