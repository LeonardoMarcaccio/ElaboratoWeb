<?php
  function UserToJSON(    //NOSONAR
    $username,
    $email,
    $password,
    $firstName,
    $lastName,
    $gender,
    $biography,
    $personalWebsite,
    $pfp,
    $phoneNumbers
    ) {
      $user = new User(
        $username,
        $email,
        $password,
        $firstName,
        $lastName,
        $gender,
        $biography,
        $personalWebsite,
        $pfp,
        $phoneNumbers
      );
      
      return json_encode($user);
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
