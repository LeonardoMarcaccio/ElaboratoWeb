<?php
  function jSONtoUser($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      return new User($assArray['username'], $assArray['email'],
      $assArray['password'], $assArray['firstName'], $assArray['lastName'],
      $assArray['gender'], $assArray['biography'], $assArray['personalWebsite'],
      $assArray['pfp'], $assArray['phoneNumbers']);
    } else {
      throw new Error("Unauthorized", 401);
    }
  }
    
  function generateJSONResponse($code, $message, $dataName = null, $data = null) {
    $jsonObject = new stdClass();
    $jsonObject->code = $code;
    $jsonObject->message = $message;
    if ($dataName != null || $data != null) {
      $jsonObject->{$dataName} = $data;
    }
    return json_encode($jsonObject);
  }
