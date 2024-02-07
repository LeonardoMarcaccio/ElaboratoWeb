<?php
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/requestcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/generalUtils.php";          //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/jsonutils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/ApiError.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/userUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/sessionUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/communityUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/commentUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/postUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/voteUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/messageUtils.php";   //NOSONAR
  
  try {
    for ($i=5; $i < 11; $i++) { 
      $password = "TestPassword_".$i;
      print_r($password);
      print_r(password_hash($password, PASSWORD_DEFAULT));
    }
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
