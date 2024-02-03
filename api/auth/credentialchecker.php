<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/requestcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/contentcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/jsonutils.php";                //NOSONAR

  try {
    assertRequestMatch('POST');
    $data = jsonToRegistration(file_get_contents("php://input"));
    $report = performCredentialReport($data);
    exit(generateJsonResponse("Ok", 200, $report));
  } catch (ApiError $thrownError) {
    die(generateJSONResponse($thrownError->getApiMessage(), $thrownError->getApiErrorCode()));
  } catch (Error $thrownError) {
    die(generateJSONResponse($thrownError->getMessage(), $thrownError->getCode()));
  }
