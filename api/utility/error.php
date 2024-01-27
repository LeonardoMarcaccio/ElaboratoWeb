<?php
    class Error{
      private $errorCode;
      private $errorMessage;

      public function __construct($errorCode, $errorMessage)
    {
      $this->errorCode=$errorCode;
      $this->errorMessage=$errorMessage;
    }
  }
