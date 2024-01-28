<?php
  require_once 'ComplianceTest.php';                //NOSONAR

  class NonEssValidity extends ComplianceTest {
    private $firstnameValid;
    private $lastnameValid;
    private $genderValid;
    private $biographyValid;
    private $personalWebsiteValid;
    private $profilePicValid;
    private $phoneNumbersValid;

    public function __construct($firstnameValid, $lastnameValid, $genderValid,
      $biographyValid, $personalWebsiteValid, $profilePicValid, $phoneNumbersValid) {
      $this->firstnameValid = $firstnameValid;
      $this->lastnameValid = $lastnameValid;
      $this->genderValid = $genderValid;
      $this->biographyValid = $biographyValid;
      $this->personalWebsiteValid = $personalWebsiteValid;
      $this->profilePicValid = $profilePicValid;
      $this->phoneNumbersValid = $phoneNumbersValid;
    }

    public function getFirstnameValid() {
      return $this->firstnameValid;
    }
    public function getCapitalCheckPassed() {
      return $this->lastnameValid;
    }
    public function getGenderValid() {
      return $this->genderValid;
    }
    public function getBiographyValid() {
      return $this->biographyValid;
    }
    public function getPersonalWebsiteValid() {
      return $this->personalWebsiteValid;
    }
    public function getProfilePicValid() {
      return $this->profilePicValid;
    }
    public function getPhoneNumbersValid() {
      return $this->phoneNumbersValid;
    }

    public function jsonSerialize() {
      return array_merge(parent::jsonSerialize(), ['firstnameValid' => $this->firstnameValid,
      'lastnameValid' => $this->lastnameValid,
      'genderValid' => $this->genderValid,
      'biographyValid' => $this->biographyValid,
      'personalWebsiteValid' => $this->personalWebsiteValid,
      'profilePicValid' => $this->profilePicValid,
      'phoneNumbersValid' => $this->phoneNumbersValid]);
    }
    public function allTestPassed() {
      return $this->firstnameValid && $this->lastnameValid && $this->genderValid
        && $this->biographyValid && $this->personalWebsiteValid
        && $this->profilePicValid && $this->phoneNumbersValid;
    }
  }
