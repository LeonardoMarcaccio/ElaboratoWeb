<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utilities/jsonutils.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utilities/db/sessionUtils.php';             //NOSONAR

  try {
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    if (!isset($_COOKIE["token"])
      || !checkTokenValidity($_COOKIE["token"], $database)) {
      throw new ApiError(HTTP_UNAUTHORIZED_ERROR, HTTP_UNAUTHORIZED_ERROR_CODE);
    }
    $user = getUsernameByToken($_COOKIE["token"], $database);
    switch($_SERVER['REQUEST_METHOD']) {
      case 'POST':
        userPostRequest($database, $user);
      break;
      case 'GET':
        userGetRequest($database, $user);
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
    }
    exit();
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }

  function userPostRequest($database, $user) {
    if(!isset($_SERVER['type'])
      && !isset($_SERVER['target'])) {
      throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    $usrObj = jsonToLogin(file_get_contents("php://input"));
    switch($_SERVER['type']) {
      case "friend":
        addFriend($user, $_GET["target"], $database);
      break;
      case "unfriend":
        removeFriend($user, $_GET["target"], $database);
      break;
      case "edit":
        updateUser($usrObj, $database);
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
    }
  }

  function userGetRequest($database, $user) {
    if(!isset($_SERVER['type'])) {
      throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    $result = null;
    switch($_SERVER['type']) {
      case "friendlist":
        if (!isset($_SERVER['target'])){
          $result = getFriendList($user, $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
        }
      break;
      case "userinfo":
        if (isset($_SERVER['target'])) {
          $result = filterInfoLevel(getUser($user, $database),
            checkInfoLevel($user, $_GET['target'], $database));
        } else {
          $result = filterInfoLevel(getUser($user, $database),
            checkInfoLevel($user, $user, $database));
        }
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
    }
    return $result;
  }
