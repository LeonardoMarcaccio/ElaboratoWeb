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
    if(!isset($_GET['type'])
      && !isset($_GET['target'])) {
      throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    $usrObj = jsonToLogin(file_get_contents("php://input"));
    switch($_GET['type']) {
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
    if(!isset($_GET['type'])) {
      throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    $result = null;
    switch($_GET['type']) {
      case "friendlist":
        if (!isset($_GET['target'])){
          $result = getFriendList($user, $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
        }
      break;
      case "userinfo":
        if (isset($_GET['target'])) {
          $result = filterInfoLevel(getUser($user, $database),
            checkInfoLevel($user, $_GET['target'], $database));
        } else {
          $result = filterInfoLevel(getUser($user, $database),
            checkInfoLevel($user, $user, $database));
        }
      break;
      case "messagelist":
        if (isset($_GET['target']) && isset($_GET['page']) && isset($_GET['maxPerPage'])) {
          $result = getChat($_GET['target'], $_GET['page'], $_GET['maxPerPage'], $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
        }
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
    }
    return $result;
  }
