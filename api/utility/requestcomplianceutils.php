<?php
  function assertRequestMatch($requestType) {
    if ($_SERVER['REQUEST_METHOD'] !== $requestType) {
      throw new ApiError("Ok", 200, "Method not allowed", 405);
    }
  }
  
  function assertSetCredentials() {
    if (!(isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW']))) {
      throw new ApiError("Ok", 200, "Invalid credentials provided", 401);
    }
  }
