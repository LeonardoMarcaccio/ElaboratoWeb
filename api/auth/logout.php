<?php
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/requestcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/generalUtils.php";          //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/jsonutils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/ApiError.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/safetyutils.php";   //NOSONAR

  try {
    assertRequestMatch('POST');
    $database = new mysqli("localhost", "root", "", "playpal");         //NOSONAR
    if (tokenSecurityCheck($database)) {
      $query = $database->prepare("DELETE FROM sessione WHERE token = ?");
      $query->bind_param("s", $_COOKIE["token"]);
      if (!$query->execute()) {
        throw getInternalError();
      }
      $noExpire = -1;
      setcookie('token', '', $noExpire, "/");
      exit(generateJSONResponse(200, "Ok"));
    } else {
      throw new ApiError(HTTP_UNAUTHORIZED_ERROR, HTTP_UNAUTHORIZED_ERROR_CODE);
    }

  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
