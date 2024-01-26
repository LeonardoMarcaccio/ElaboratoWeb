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

<<<<<<< HEAD
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
            $this->personalWebsite=$personalWebsite;
            $this->pfp=$pfp;
            $this->phoneNumbers=$phoneNumbers;
        }

        public function getUsername() {
            return $this->username;
        }

        public function getEmail() {
            return $this->email;
        }

        public function setEmail($email) {
            $this->email = $email;
        }

        public function getPassword() {
            return $this->password;
        }

        public function setPassword($password) {
            $this->password = $password;
        }

        public function getFirstName() {
            return $this->firstName;
        }

        public function setFirstName($firstName) {
            $this->firstName = $firstName;
        }

        public function getLastName($lastName) {
            return $this->lastName;
        }

        public function setLastName($lastName) {
            $this->lastName = $lastName;
        }

        public function getGender() {
            return $this->gender;
        }

        public function setGender($gender) {
            $this->gender = $gender;
        }

        public function getBiography() {
            return $this->biography;
        }

        public function setBiography($biography) {
            $this->biography = $biography;
        }

        public function getPersonalWebsite() {
            return $this->personalWebsite;
        }

        public function setPersonalWebsite($personalWebsite) {
            $this->personalWebsite = $personalWebsite;
        }

        public function getPfp() {
            return $this->pfp;
        }

        public function setPfp($pfp) {
            $this->pfp = $pfp;
        }

        public function getPhoneNumbers() {
            return $this->phoneNumbers;
        }

        public function setPhoneNumbers($phoneNumbers) {
            $this->phoneNumbers = $phoneNumbers;
        }
=======
    public function __construct(  //NOSONAR
      $username, $email, $password, $firstName,
      $lastName, $gender, $biography, $personalWebsite, $pfp, $phoneNumbers) {

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
>>>>>>> 55469eecd6e48ed9963926f1bdbb3bd55a14aebe
    }
  }
