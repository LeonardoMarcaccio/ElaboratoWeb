<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/error.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/jsonhelper.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/requestcomplianceutils.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/contentcomplianceutils.php'; //NOSONAR

  try {
    assertRequestMatch('POST');
    try {
      $usrObj = jSONtoUser(file_get_contents("php://input"));
      $report = performCredentialReport($usrObj);
      if ($report->allTestPassed()) {
        // Here a query should be performed
      }
      exit(generateJSONResponse(401, "Invalid Information", $report));
    } catch (Error $thrownError) {
      throw new ApiError("Ok", 200, "Invalid JSON Format", 401);
    }
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
