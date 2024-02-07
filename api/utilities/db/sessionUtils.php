<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/safetyutils.php";  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

  function createSession($token, $username, mysqli $database) {
    $statement = $database->prepare("INSERT INTO sessione (Token, Date, Username) VALUES (?, NOW(), ?)");
    $statement->bind_param("ss", $token, $username);
    if (!$statement->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
  }

  function generateUniqueToken(mysqli $database) {
    $query = $database->prepare("SELECT * FROM sessione WHERE Token = ? LIMIT 1");
    $generatedToken = null;
    
    do {
      $generatedToken = generateToken();
      $query->bind_param("s", $generatedToken);
      if (!$query->execute()) {
        throw new ApiError("Internal Server Error", 500,                //NOSONAR
        DB_CONNECTION_ERROR, 500);
      }
      $result = mysqli_fetch_assoc($query->get_result());
    } while ($result);
    
    return $generatedToken;
  }

  function updateSession($token, $username, mysqli $database) {
    $statement = $database->prepare("UPDATE sessione SET Date = NOW() WHERE Token = ?");
    $statement->bind_param("ss", $token, $username);
    if (!$statement->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
  }

  function getUsernameByToken($token, mysqli $database) {
    $statement = $database->prepare("SELECT Username FROM sessione WHERE Token = ?");
    $statement->bind_param("s", $token);
    if (!$statement->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }

    $username = mysqli_fetch_assoc($statement->get_result());

    return ($username !== null) ? $username["Username"] : false;
  }

  function deleteOldTokens(mysqli $database, $ttlToken) {
    $statement = $database->prepare("DELETE FROM sessione WHERE TIMESTAMPDIFF(SECOND, Date, NOW()) > ?");
    $statement->bind_param("i", $ttlToken);
    if (!$statement->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
  }

  function checkTokenValidity($token, mysqli $database) {
    deleteOldTokens($database, DEFAULT_TOKEN_TTL);
    $statement = $database->prepare("SELECT * FROM sessione WHERE Token = ?");
    $statement->bind_param("s", $token);
    if (!$statement->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
    
    $token = $statement->get_result();
    if (mysqli_num_rows($token) !== 1) {
        return false;
    }

    return true;
  }
