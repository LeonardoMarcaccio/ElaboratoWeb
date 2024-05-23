<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

  function sanitizeInput($usrInput) {
    return htmlspecialchars(strip_tags($usrInput), ENT_QUOTES, 'UTF-8');
  }
  function generateToken($length = 32) {
    return uniqid("", true);
  }
  function filterInfoLevel(UserData $userObject, $infoLevel) {
    $firstname = null;
    $lastname = null;
    $phonenumbers = null;
    $email = null;
    $pfp = null;
    $gender = null;
    $username = null;
    $biography = null;
    $personalwebsite = null;
    switch($infoLevel) {
      case USER_SELF:                                                 //NOSONAR
        $firstname = $userObject->getFirstName();
        $lastname = $userObject->getLastName();
      case USER_FRIEND:                                               //NOSONAR
        $phonenumbers = $userObject->getPhoneNumbers();
        $email = $userObject->getEmail();
      case USER_STRANGER:
        $pfp = $userObject->getPfp();
        $gender = $userObject->getGender();
        $username = $userObject->getUsername();
        $biography = $userObject->getBiography();
        $personalwebsite = $userObject->getPersonalWebsite();
      break;
      default:
        return filterInfoLevel($userObject, USER_STRANGER);
      }
      return new UserData($username, $email, null, $firstname,
        $lastname, $gender, $biography, $personalwebsite, $pfp, $phonenumbers);
  }
  function tokenSecurityCheck(mysqli $database) {
   return isset($_COOKIE["token"]) && checkTokenValidity($_COOKIE["token"], $database);
  }