<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/user.php'; //NOSONAR

  class UsernameValidityReport implements JsonSerializable {
    private $lengthCheckPassed;
    private $validCharacterPassed;

    public function __construct($lengthCheckPassed, $validCharacterPassed) {
      $this->lengthCheckPassed = $lengthCheckPassed;
      $this->validCharacterPassed = $validCharacterPassed;
    }

    public function getLengthCheckPassed() {
      return $this->lengthCheckPassed;
    }
    public function getValidCharacterPassed() {
      return $this->validCharacterPassed;
    }

    public function jsonSerialize() {
      return [
          'lengthCheckPassed' => $this->lengthCheckPassed,
          'validCharacterPassed' => $this->validCharacterPassed,
      ];
  }
  }
  class EmailValidityReport implements JsonSerializable {
    private $atCheckPassed;

    public function __construct($atCheckPassed) {
      $this->atCheckPassed = $atCheckPassed;
    }

    public function getValidCharacterPassed() {
      return $this->atCheckPassed;
    }

    public function jsonSerialize() {
      return ['atCheckPassed' => $this->atCheckPassed];
    }
  }
  class PasswordValidityReport implements JsonSerializable {
    private $lengthCheckPassed;
    private $capitalCheckPassed;
    private $nonCapitalCheckPassed;
    private $numberCheckPassed;
    private $specialCharCheckPassed;
    private $punctuationCheckPassed;

    public function __construct($lengthCheckPassed, $capitalCheckPassed,
      $nonCapitalCheckPassed, $numberCheckPassed, $specialCharCheckPassed, $punctuationCheckPassed) {
      $this->lengthCheckPassed = $lengthCheckPassed;
      $this->capitalCheckPassed = $capitalCheckPassed;
      $this->nonCapitalCheckPassed = $nonCapitalCheckPassed;
      $this->numberCheckPassed = $numberCheckPassed;
      $this->specialCharCheckPassed = $specialCharCheckPassed;
      $this->punctuationCheckPassed = $punctuationCheckPassed;
    }

    public function getLengthCheckPassed() {
      return $this->lengthCheckPassed;
    }
    public function getCapitalCheckPassed() {
      return $this->capitalCheckPassed;
    }
    public function getNonCapitalCheckPassed() {
      return $this->nonCapitalCheckPassed;
    }
    public function getNumberCheckPassed() {
      return $this->numberCheckPassed;
    }
    public function getSpecialCharCheckPassed() {
      return $this->specialCharCheckPassed;
    }
    public function getPunctuationCheckPassed() {
      return $this->punctuationCheckPassed;
    }

    public function jsonSerialize() {
      return ['lengthCheckPassed' => $this->lengthCheckPassed,
        'capitalCheckPassed' => $this->capitalCheckPassed,
        'nonCapitalCheckPassed' => $this->nonCapitalCheckPassed,
        'numberCheckPassed' => $this->numberCheckPassed,
        'specialCharCheckPassed' => $this->specialCharCheckPassed,
        'punctuationCheckPassed' => $this->punctuationCheckPassed];
    }
  }
  class NonEssValidity implements JsonSerializable {
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
      return ['firstnameValid' => $this->firstnameValid,
      'lastnameValid' => $this->lastnameValid,
      'genderValid' => $this->genderValid,
      'biographyValid' => $this->biographyValid,
      'personalWebsiteValid' => $this->personalWebsiteValid,
      'profilePicValid' => $this->profilePicValid,
      'phoneNumbersValid' => $this->phoneNumbersValid];
    }
  }

  function standardStringValidity($stringToCheck, $maximumLength = null, $mustNotMatchRegex = null) {
    $result = false;
    if ($maximumLength !== null) {
      $result = $result || (strlen($stringToCheck) < $maximumLength);
    }
    if ($mustNotMatchRegex !== null) {
      $result = $result || !preg_match($mustNotMatchRegex, $stringToCheck);
    }
    return $result;
  }
  function checkUsernameValidity($username) {
    // Length check & no punctuation check
    return new UsernameValidityReport(standardStringValidity($username, 50),
      standardStringValidity($username, '/[!@#$%^&*(),.?":{}|<>]/')); // NOSONAR
  }
  function checkPasswordValidity($password) {
    // Length check
    $lengthCheck = strlen($password) > 8;
    // Capital check
    $capitalCheck = preg_match('/[A-Z]/', $password);
    // Non-capital check
    $nonCapitalCheck = preg_match('/[a-z]/', $password);
    // Number check
    $numberCheck = preg_match('/\d/', $password);
    // SpecialChar check
    $specialCharCheck = preg_match('/[^a-zA-Z0-9]/', $password);
    // Punctuation check
    $punctuationCheck = preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password);
    // Se la password supera tutti i controlli, è considerata sicura
    return new PasswordValidityReport($lengthCheck, $capitalCheck, $nonCapitalCheck, $numberCheck, $specialCharCheck, $punctuationCheck);
  }
  function checkEmailValidity($email) {
    // @ check
    return new EmailValidityReport(strpos($email, '@'));
  }
  function checkNonEssValidity(User $userContainer) {
    $firstNameCheck = standardStringValidity($userContainer->getFirstName(), 50,
      '/[!@#$%^&*(),.?":{}|<>]/');
    $lastNameCheck = standardStringValidity($userContainer->getLastName(), 50,
      '/[!@#$%^&*(),.?":{}|<>]/');
    $genderCheck = true;
    $biographyValid = standardStringValidity($userContainer->getBiography(), 500);
    $personalWebsiteCheck = standardStringValidity($userContainer->getPersonalWebsite(), 500);
    $profilePicCheck = standardStringValidity($userContainer->getPfp(), 500);
    $phoneNumberCheck = true;     // TODO: Check for each number if it conforms with standards.

    return new NonEssValidity($firstNameCheck, $lastNameCheck,
      $genderCheck, $biographyValid, $personalWebsiteCheck,
      $profilePicCheck, $phoneNumberCheck);
  }
