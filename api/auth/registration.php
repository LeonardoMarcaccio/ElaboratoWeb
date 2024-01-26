<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/jsonhelper.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/requestcomplianceutils.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/contentcomplianceutils.php'; //NOSONAR

  try {
    assertRequestMatch('POST');
    $usrObj = jSONtoUser(file_get_contents("php://input"));
  } catch (Error $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getCode(), $thrownError->getMessage()));
  }
