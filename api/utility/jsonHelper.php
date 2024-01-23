<?php
    function UserToJSON(
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

    function ErrorToJSON($errorCode, $errorMessage){
        $error=new Error($errorCode, $errorMessage);
        return json_encode($error);
    }
?>
    
