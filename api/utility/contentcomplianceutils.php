<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/user.php'; //NOSONAR

  class UsernameValidityReport {
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
  }
  class EmailValidityReport {
    private $atCheckPassed;

    public function __construct($atCheckPassed) {
      $this->atCheckPassed = $atCheckPassed;
    }

    public function getValidCharacterPassed() {
      return $this->atCheckPassed;
    }
  }
  class PasswordValidityReport {
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
  }

  function checkUsernameValidity($username) {
    // Length check & no punctuation check
    return new UsernameValidityReport(strlen($username) > 8, preg_match('/[!@#$%^&*(),.?":{}|<>]/', $username));
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
