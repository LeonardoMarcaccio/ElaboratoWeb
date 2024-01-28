<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/error.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/jsonhelper.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/requestcomplianceutils.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/contentcomplianceutils.php'; //NOSONAR

  try {
    assertRequestMatch('POST');
    $usrObj;
    try {
      $usrObj = jSONtoUser(file_get_contents("php://input"));
    } catch (Error $thrownError) {
      throw new ApiError("Ok", 200, "Invalid JSON Format", 401);
    }
    
    /*if (!$unameValidityReport->getLengthCheckPassed() //NOSONAR
      || !$unameValidityReport->getValidCharacterPassed()) {
        throw new ApiError("Ok", 200, "Invalid characters in username", 401);
    }
    if (!$emailValidityReport->getValidCharacterPassed()) {
      throw new ApiError("Ok", 200, "Provided email is invalid!", 401);
    }
    if (!$passwdValidityReport->getLengthCheckPassed()
      || !$passwdValidityReport->getCapitalCheckPassed()) {

    }*/
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
