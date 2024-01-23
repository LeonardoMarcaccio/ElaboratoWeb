<?php
    class User {
        private $username;
        private $email;
        private $password;
        private $firstName;
        private $lastName;
        private $gender;
        private $biography;
        private $personalWebsite;
        private $pfp;
        private $phoneNumbers;

        public function __construct(
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
            $this->username=$username;
            $this->email=$email;
            $this->password=$password;
            $this->firstName=$firstName;
            $this->lastName=$lastName;
            $this->gender=$gender;
            $this->biography=$biography;
            $this->biography=$biography;
            $this->personalWebsite=$personalWebsite;
            $this->pfp=$pfp;
            $this->phoneNumbers=$phoneNumbers;
        }
    }
?>
