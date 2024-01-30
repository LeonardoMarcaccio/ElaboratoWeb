<?php
  try {
    assertRequestMatch('POST');
    $usrObj = jsonToLogin(file_get_contents("php://input"));
    
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
