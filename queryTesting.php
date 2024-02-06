<?php
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/requestcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/generalUtils.php";          //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/jsonutils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/ApiError.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/userUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/sessionUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/communityUtils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/db/postUtils.php";   //NOSONAR
  
  try {
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    $tmp = file_get_contents("php://input");
    getRecentPost(5, "cantepente1", $database);
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
