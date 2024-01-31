<?php
  try {
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    if (!isset($_COOKIE["token"])
      || !checkTokenValidity($_COOKIE["token"],
        getNicknameByToken($_COOKIE["token"], $database), $database)) {
      throw new ApiError(HTTP_UNAUTHORIZED_ERROR, HTTP_UNAUTHORIZED_ERROR_CODE);
    }
    $user = getNicknameByToken($_COOKIE["token"], $database);
    switch($_SERVER['REQUEST_METHOD']) {
      case 'POST':
        userPostRequest($database, $user);
      break;
      case 'GET':
       userGetRequest($database, $user);
      break;
    }
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }

  function userPostRequest($database, $user) {
    if(!isset($_SERVER['type'])
      && !isset($_SERVER['target'])) {
      throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    switch($_SERVER['type']) {
      case "friend":

      break;
      case "unfriend":
        //post creation function
        //createCommunityPost($targetCommunity, $requestBody);
      break;
    }
  }

  function userGetRequest($database, $user) {
    if(!isset($_SERVER['type'])
      && !isset($_SERVER['target'])) {
      throw new ApiError("Bad Request", 400);
    }
    switch($_SERVER['type']) {
      case "friendlist":
        
      break;
    }
  }
