<?php
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
    $dbNames = ['Email' => $userObj->getEmail(),
      'Password' => $userObj->getPassword(),
      'FirstName' => $userObj->getFirstName(),
      'LastName' => $userObj->getLastName(),
      'Gender' => $userObj->getGender(),
      'Biography' => $userObj->getBiography(),
      'PersonalWebsite' => $userObj->getPersonalWebsite(),
      'Pfp' => $userObj->getPfp(),
      'Phonenumbers' => $userObj->getPhoneNumbers()];

    $target = getUsernameByToken($_COOKIE['token'], $database);
    $queryString = "UPDATE user SET ";
    
    foreach ($dbNames as $dbEntry => $dbValue) {
      $queryString .= " ".$dbEntry." = ?";
    }

    $preparedQuery = $database->prepare($queryString." WHERE Username = ?");
    
    foreach ($dbNames as $dbEntry => $dbValue) {
      $preparedQuery->bind_param("s", $dbValue);
    }
    
    $preparedQuery->bind_param("s", $target);
    
    if (!$preparedQuery->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE);
    }
  }

  function updateUserOneQuery($requestBody, mysqli $database) {
    $userObj = jsonToRegistration($requestBody);
    $target = getUsernameByToken($_COOKIE['token'], $database);

    $preparedQuery = $database->prepare(
      "UPDATE user SET Email = ?, Password = ?, FirstName = ?, LastName = ?, Gender = ?, Biography = ?, PersonalWebsite = ?, Pfp = ?,  PhoneNumbers = ? WHERE Username = ?");
    $preparedQuery->bind_param(
      "ssssssssss",
      $userObj->getEmail(),
      $userObj->getPassword(),
      $userObj->getFirstName(),
      $userObj->getLastName(),
      $userObj->getGender(),
      $userObj->getBiography(),
      $userObj->getPersonalWebsite(),
      $userObj->getPfp(),
      $userObj->getPhoneNumbers(),
      $target
    );
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
