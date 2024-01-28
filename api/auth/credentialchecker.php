<?php
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/error.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/jsonHelper.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/requestcomplianceutils.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/contentcomplianceutils.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/classes/reports/FullComplianceReport.php"; //NOSONAR

  try {
    assertRequestMatch('POST');
    $data = jSONtoUser(file_get_contents("php://input"));
    $report = performCredentialReport($data);
    exit(generateJsonResponse("Ok", 200, $report));
  } catch (ApiError $thrownError) {
    die(generateJSONResponse($thrownError->getApiMessage(), $thrownError->getApiErrorCode()));
  } catch (Error $thrownError) {
    die(generateJSONResponse($thrownError->getMessage(), $thrownError->getCode()));
  }
