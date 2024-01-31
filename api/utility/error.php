<?php
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
