<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/requestcomplianceutils.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/jsonhelper.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/safetyutils.php';            //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/error.php';                  //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/dbutils.php";                //NOSONAR

  try {
    assertRequestMatch('POST');
    $usrObj = jsonToLogin(file_get_contents("php://input"));
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    $queriedUser = checkUserPresence($usrObj->getUsername(), $database);
    if ($queriedUser !== false) {
      if (isset($_COOKIE["token"])
        && checkTokenValidity($_COOKIE["token"], $usrObj->getUsername(), $database)) {
        exit(generateJSONResponse(200, "Ok"));
      }
      $token = generateUniqueToken($database);
      $username = $usrObj->getUsername();
      $tokenQuery = $database->prepare("INSERT INTO sessione (Token, Date, Username) VALUES (?, NOW(), ?)");
      $tokenQuery->bind_param("ss", $token, $username);

      if (!$tokenQuery->execute()) {
        throw new ApiError("Internal Server Error", 500,                
          DB_CONNECTION_ERROR, 500);
      }

      setcookie("token", $token, DEFAULT_TOKEN_TTL, "/");
      exit(generateJSONResponse(200, "Ok"));
    }
  } catch (ApiError $thrownError) {
    echo $thrownError;
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
