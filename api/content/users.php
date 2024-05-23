<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utilities/jsonutils.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utilities/db/sessionUtils.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utilities/db/userUtils.php';             //NOSONAR

  try {
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    if (tokenSecurityCheck($database)) {
      $user = getUsernameByToken($_COOKIE["token"], $database);
      $result = null;
      switch($_SERVER['REQUEST_METHOD']) {
        case 'POST':
          $result = userPostRequest($database, $user);
        break;
        case 'GET':
          $result = userGetRequest($database, $user);
          break;
          default:
          throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
        }
        exit(generateJSONResponse(200, "Ok", $result));
    } else {
      throw new ApiError(HTTP_UNAUTHORIZED_ERROR, HTTP_UNAUTHORIZED_ERROR_CODE);
    }
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
    return null;
  }

  function userGetRequest($database, $user) {
    if(!isset($_GET['type'])) {
      throw new ApiError("Bad Request", 400);
    }
    $result = null;
    switch($_GET['type']) {
      case "friendlist":
        if (isset($_GET['target'])) {
          $result = getFriendList($user, $database);
        } else {
          throw new ApiError("Bad Request", 400);
        }
      break;
      case "userinfo":
        if (isset($_GET['target'])) {
          $result = filterInfoLevel(getUser($_GET['target'], $database),
            checkInfoLevel($user, $_GET['target'], $database));
        } else {
          $result = filterInfoLevel(getUser($user, $database), USER_SELF);
        }
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
    }
    return $result;
  }
