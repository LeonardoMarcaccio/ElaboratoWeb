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
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    $tmp = file_get_contents("php://input");
    createMessage("cantepente1", "Bomboclater22", "KEKW", $database);
    createMessage("Bomboclater22", "cantepente1", "WKEK", $database);
    //print_r(getSubComment(1, 2, 5, $database));
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
