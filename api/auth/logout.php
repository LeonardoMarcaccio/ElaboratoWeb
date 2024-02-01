<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/requestcomplianceutils.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/jsonhelper.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/safetyutils.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/error.php';                  //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/dbutils.php";                //NOSONAR

  try {
    assertRequestMatch('GET');
    $database = new mysqli("localhost", "root", "", "playpal");
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
    echo $thrownError;
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }