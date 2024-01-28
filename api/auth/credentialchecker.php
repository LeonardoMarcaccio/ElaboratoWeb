<?php
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/error.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/jsonHelper.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/requestcomplianceutils.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/contentcomplianceutils.php"; //NOSONAR

  function performCredentialReport($usrObj) {
    $passwdValidityReport = checkPasswordValidity($usrObj->getPassword());
    $unameValidityReport = checkUsernameValidity($usrObj->getUsername());
    $emailValidityReport = checkEmailValidity($usrObj->getEmail());
    $nonEssentialDataValidityReport = checkNonEssValidity($usrObj);

    $reportObj = new stdClass();
    $reportObj->passwdValidityReport = $passwdValidityReport;
    $reportObj->unameValidityReport = $unameValidityReport;
    $reportObj->emailValidityReport = $emailValidityReport;
    $reportObj->nonEssentialDataValidityReport = $nonEssentialDataValidityReport;

    return $reportObj;
  }

  try {
    assertRequestMatch('POST');
    $data = jSONtoUser(file_get_contents("php://input"));
    $report = performCredentialReport($data);
    exit(generateJsonResponse("Ok", 200, "fullCredentialReport", $report));
  } catch (ApiError $thrownError) {
    die(generateJSONResponse($thrownError->getApiMessage(), $thrownError->getApiErrorCode()));
  } catch (Error $thrownError) {
    die(generateJSONResponse($thrownError->getMessage(), $thrownError->getCode()));
  }
