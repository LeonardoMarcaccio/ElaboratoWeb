<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

  define("DEFAULT_TOKEN_TTL", 36000);
  define("ATTEMPTS_RESET_TIME", 36000);
  define("MAXIMUM_LOGIN_TRIES", 5);

  function isValueInColumn($table, $columnName, $value, mysqli $database) {
    $statement = $database->prepare("SELECT COUNT(*) FROM $table WHERE $columnName = ?");
    $statement->bind_param("s", $value);
    if (!$statement->execute()) {
      throw getInternalError();
    }
    $value = $statement->get_result();
    $countResult = mysqli_fetch_assoc($value);
    return $countResult['COUNT(*)'] > 0;
  }
