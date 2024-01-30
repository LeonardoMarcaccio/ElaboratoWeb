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
            "s", $assArray['email'],
            "s", $assArray['password'],
            "s", $assArray['firstname'],
            "s", $assArray['lastname'],
            "s", $assArray['gender'],
            "s", $assArray['gender'],
            "s", $assArray['biography'],
            "s", $assArray['personalwebsite'],
            "s", $assArray['pfp'],
            "s", $assArray['phonenumbers'],
            "s", $assArray['username']
        );
        
        $query->execute();

        $con->close();
    } else {
      throw new ApiError("Ok", 200, "Invalid user data", 401);
    }
}
