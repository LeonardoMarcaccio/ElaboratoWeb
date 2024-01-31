<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/requestcomplianceutils.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/jsonhelper.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/safetyutils.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/error.php';                  //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/dbutils.php";                //NOSONAR

  try {
    //assertRequestMatch('POST');
    //$usrObj = jsonToLogin(file_get_contents("php://input"));
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    echo areUsersFriends("Pino", "Peppino", $database);
    if (isset($_COOKIE["token"])) {
      
    }
    $queriedUser = checkUserPresence($usrObj, $database);
    if ($queriedUser !== false) {
      $token = generateToken();
      
    }
  } catch (ApiError $thrownError) {
    echo $thrownError;
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
