<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/requestcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/jsonutils.php";                //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/userUtils.php";             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/sessionUtils.php";          //NOSONAR

  try {
    assertRequestMatch('POST');
    $usrObj = jsonToLogin(file_get_contents("php://input"));
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    $password = $usrObj->getPassword();
    $queriedUser = getLoggedUser($usrObj->getUsername(), $password, $database);
    if (is_a($queriedUser, 'UserData')) {
      if (isset($_COOKIE["token"])
        && checkTokenValidity($_COOKIE["token"], $database)) {
        exit(generateJSONResponse(200, "Ok"));
      }
      $token = generateUniqueToken($database);
      $username = $usrObj->getUsername();
      createSession($token, $username, $database);

      setcookie("token", $token, time() + DEFAULT_TOKEN_TTL, "/");
      exit(generateJSONResponse(200, "Ok"));
    } else {
      throw new ApiError(HTTP_UNAUTHORIZED_ERROR, HTTP_UNAUTHORIZED_ERROR_CODE);
    }
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
