<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/jsonhelper.php'; //NOSONAR

  try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      throw new Error("Wrong method", 405);
    }
    if (!(isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW']))) {
      throw new Error("No authentication info provided", 405);
    }
    
  } catch (Error $thrownError) {
    $errMsg = " 405 Not Allowed";
    header($_SERVER["SERVER_PROTOCOL"] . $errMsg);
    die(generateJSONResponse($thrownError->getCode(), $thrownError->getMessage()));
  }
