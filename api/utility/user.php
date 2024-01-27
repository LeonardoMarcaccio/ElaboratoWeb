<?php
  class User {                    //NOSONAR
    private $username;            // Essential
    private $email;               // Essential
    private $password;            // Essential
    private $firstName;           // Non Essential
    private $lastName;            // Non Essential
    private $gender;              // Non Essential
    private $biography;           // Non Essential
    private $personalWebsite;     // Non Essential
    private $pfp;                 // Non Essential
    private $phoneNumbers;        // Non Essential

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
      $this->personalWebsite=$personalWebsite;
      $this->pfp=$pfp;
      $this->phoneNumbers=$phoneNumbers;
    }

    public function getUsername() {
      return $this->username;
    }
    public function setUsername($username) {
      $this->username = $username;
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
    public function getLastName() {
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

    public function expose() {
      return get_object_vars($this);
    }
  }
