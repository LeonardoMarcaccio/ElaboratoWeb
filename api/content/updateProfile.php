<?php
  function updateProfileQuery($jsonString) {
    $con = new mysqli('localhost', 'root', '', 'immagini', 3306); //TODO: Inserisci i criteri di connessione
    if ($con->connect_error) {
      die("Connection failed: " . $con->connect_error);
    }
    
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      $query = $con->prepare(
        "UPDATE user set email=?,
        password=?,
        firstName=?,
        lastName=?,
        gender=?,
        biography=?,
        personalWebsite=?,
        pfp=?,
        phonenumbers=?
        WHERE username=?"
      );
      
      $query->bind_param(
        "sssssssssss",
        $assArray['email'],
        $assArray['password'],
        $assArray['firstname'],
        $assArray['lastname'],
        $assArray['gender'],
        $assArray['gender'],
        $assArray['biography'],
        $assArray['personalwebsite'],
        $assArray['pfp'],
        $assArray['phonenumbers'],
        $assArray['username']
      );
      
      if (!$query->execute()) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
      }
      
      $con->close();
    } else {
      throw new ApiError("Ok", 200, "Invalid user data", 401);
    }
  }
