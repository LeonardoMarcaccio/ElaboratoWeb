<?php
  define("DB_CONNECTION_ERROR", "Error while contacting database");
  define("DB_CONNECTION_ERROR_CODE", 500);
  define("HTTP_BAD_REQUEST_ERROR", "Bad Request");
  define("HTTP_BAD_REQUEST_ERROR_CODE", 400);
  define("HTTP_UNAUTHORIZED_ERROR_CODE", 401);
  define("HTTP_UNAUTHORIZED_ERROR", "Unauthorized");
  define("HTTP_INTERNAL_SERVER_ERROR", "Internal Server Error");
  define("HTTP_INTERNAL_SERVER_ERROR_CODE", 500);
  define("API_INVALID_USER_DATA_ERROR", "Invalid User Data");
  define("API_INVALID_USER_DATA_ERROR_CODE", 401);

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

  function getInternalError() {
    return new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
      DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
  }
