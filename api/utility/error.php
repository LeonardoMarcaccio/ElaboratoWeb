<?php
  define("DB_CONNECTION_ERROR", "Error while contacting database");
  define("DB_CONNECTION_ERROR_CODE", 500);
  define("HTTP_BAD_REQUEST_ERROR", "Bad Request");
  define("HTTP_BAD_REQUEST_ERROR_CODE", 400);
  define("HTTP_UNAUTHORIZED_ERROR_CODE", "Unauthorized");
  define("HTTP_UNAUTHORIZED_ERROR", 400);

    class ApiError extends Exception {
      private $apiErrorMessage;
      private $apiErrorCode;

      public function __construct($errorString, $errorCode, $apiErrorMessage = null, $apiErrorCode = null) {
        parent::__construct($errorString, $errorCode);
        $this->apiErrorMessage = $apiErrorMessage !== null
          ? $apiErrorMessage
          : $errorString;
        $this->apiErrorCode = $apiErrorCode !== null
          ? $apiErrorCode
          : $errorCode;
    }

    public function getApiMessage() {
      return $this->apiErrorMessage;
    }
    public function getApiErrorCode() {
      return $this->apiErrorCode;
    }
  }
