<?php
  define("DEFAULT_TOKEN_TTL",  time() + 36000);

  function isValueInColumn($table, $columnName, $value, mysqli $database) {
    $statement = $database->prepare("SELECT COUNT(*) FROM $table WHERE $columnName = ?");
    $statement->bind_param("s", $value);
    if (!$statement->execute()) {
      throw new ApiError("Internal Server Error", 500,                //NOSONAR
        DB_CONNECTION_ERROR, 500);
    }
  
    $value = $statement->get_result();
    return mysqli_fetch_assoc($value) > 0;
  }
