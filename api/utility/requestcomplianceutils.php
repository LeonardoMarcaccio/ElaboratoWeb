<?php
  function assertRequestMatch($requestType) {
    if ($_SERVER['REQUEST_METHOD'] !== $requestType) {
      throw new Error("Not allowed", 405);
    }
  }
  
  function assertSetCredentials() {
    if (!(isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW']))) {
      throw new Error("Invalid credentials provided", 401);
    }
  }
