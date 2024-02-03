<?php
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/requestcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/generalUtils.php";          //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/utilities/jsonutils.php";   //NOSONAR
  require_once $_SERVER["DOCUMENT_ROOT"] . "/api/classes/ApiError.php";   //NOSONAR

  try {
    assertRequestMatch('GET');
    $database = new mysqli("localhost", "root", "", "playpal");         //NOSONAR
    if (isset($_COOKIE["token"])) {
        
      if (!isValueInColumn("sessione", "Token", $_COOKIE["token"], $database)) {
        throw new ApiError("Unauthorized Access", 401);
      }

      $query = $database->prepare("DELETE FROM sessione WHERE token = ?");
      $query->bind_param("s", $_COOKIE["token"]);
      if (!$query->execute()) {
        throw new ApiError("Internal Server Error", 500,
          DB_CONNECTION_ERROR, 500);
      }

      setcookie('token', '', -1, "/");
      exit(generateJSONResponse(200, "Ok"));
    } else {
      throw new ApiError("Unauthorized Access", 401);
    }

  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }
