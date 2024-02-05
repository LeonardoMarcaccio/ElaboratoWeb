<?php
  require_once "EssentialUserData.php";                 //NOSONAR

  class UserData extends EssentialUserData {
    private $firstName;           // Non Essential
    private $lastName;            // Non Essential
    private $gender;              // Non Essential
    private $biography;           // Non Essential
    private $personalWebsite;     // Non Essential
    private $pfp;                 // Non Essential
    private $phoneNumbers;        // Non Essential
    private $id;

    public function __construct(  //NOSONAR
      $username = null, $email = null, $password = null, $firstName = null,
      $lastName = null, $gender = null, $biography = null,$personalWebsite = null,
      $pfp = null, $phoneNumbers = null, $id = null) {
      parent::__construct($username, $email, $password);
      $this->firstName = $firstName;
      $this->lastName = $lastName;
      $this->gender = $gender;
      $this->biography = $biography;
      $this->personalWebsite = $personalWebsite;
      $this->pfp = $pfp;
      $this->phoneNumbers = $phoneNumbers;
      $this->id = $id;
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
    public function getId() {
      return $this->id;
    }
    public function setId($id) {
      $this->id = $id;
    }
  }
