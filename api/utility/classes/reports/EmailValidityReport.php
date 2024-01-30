<?php
  require_once 'ComplianceTest.php';                //NOSONAR

  class EmailValidityReport extends ComplianceTest {
    private $emailValid;

    public function __construct($emailValid) {
      $this->emailValid = $emailValid;
    }

    public function getValidCharacterPassed() {
      return $this->emailValid;
    }

    public function jsonSerialize() {
      return array_merge(parent::jsonSerialize(),
        ['emailValid' => $this->emailValid]);
    }
    public function allTestPassed() {
      return $this->emailValid;
    }
  }
