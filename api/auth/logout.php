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
        $query = $database->prepare("SELECT Username FROM session WHERE token=?");
        $query->bind_param("s", $_COOKIE["token"]);
        if (!$query->execute()) {
        throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }
        $user = $query->get_result();
        
        if (mysqli_num_rows($result)==0) {
            throw new ApiError("Unauthorized Access", 401);
        }

        $query = $database->prepare("DELETE session WHERE token=?");
        $query->bind_param("s", $_COOKIE["token"]);
        if (!$query->execute()) {
        throw new ApiError("Internal Server Error", 500,                
            DB_CONNECTION_ERROR, 500);
        }

    } else {
        throw new ApiError("Unauthorized Access", 401);
    }

  } catch (ApiError $thrownError) {
    echo $thrownError;
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }