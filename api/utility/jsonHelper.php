<?php
  define("USER_SELF", 0);
  define("USER_FRIEND", 0);
  define("USER_STRANGER", 0);

  function jsonToRegistration($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      return new UserData($assArray['username'], $assArray['email'],
      $assArray['password'], $assArray['firstname'], $assArray['lastname'],
      $assArray['gender'], $assArray['biography'], $assArray['personalwebsite'],
      $assArray['pfp'], $assArray['phonenumbers']);
    } else {
      throw new ApiError("Ok", 200, "Invalid user data", 401);
    }
  }
  function jsonToLogin($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      return new EssentialUserData($assArray['username'], $assArray['email'],
      $assArray['password']);
    } else {
      throw new ApiError("Ok", 200, "Invalid user data", 401);
    }
  }
    
  function generateJSONResponse($code, $message, $data = null, $dataName = "response") {
    $jsonObject = new stdClass();
    $jsonObject->code = $code;
    $jsonObject->message = $message;
    if ($dataName != null && $data != null) {
      $jsonObject->{$dataName} = $data;
    }
    return json_encode($jsonObject);
  }

  function gatherJsonInfo(UserData $userContainer, $infoLevel = USER_STRANGER) {
    $userJson = new stdClass();
    switch($infoLevel) {                                              //NOSONAR
      case USER_SELF:                                                 //NOSONAR
        $userJson->firstname = $userContainer->getFirstName();
        $userJson->lastname = $userContainer->getLastName();
      case USER_FRIEND:                                               //NOSONAR
        $userJson->phonenumbers = $userContainer->getPhoneNumbers();
        $userJson->email = $userContainer->getEmail();
      case USER_STRANGER:
        $userJson->pfp = $userContainer->getPfp();
        $userJson->gender = $userContainer->getGender();
        $userJson->username = $userContainer->getUsername();
        $userJson->biography = $userContainer->getBiography();
        $userJson->personalwebsite = $userContainer->getPersonalWebsite();
    }
    return $userJson;
  }
