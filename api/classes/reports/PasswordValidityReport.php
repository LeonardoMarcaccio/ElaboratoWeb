<?php
  require_once 'ComplianceTest.php';                //NOSONAR

  class PasswordValidityReport extends ComplianceTest {
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
      return array_merge(parent::jsonSerialize(), ['lengthCheckPassed' => $this->lengthCheckPassed,
        'capitalCheckPassed' => $this->capitalCheckPassed,
        'nonCapitalCheckPassed' => $this->nonCapitalCheckPassed,
        'numberCheckPassed' => $this->numberCheckPassed,
        'specialCharCheckPassed' => $this->specialCharCheckPassed,
        'punctuationCheckPassed' => $this->punctuationCheckPassed]);
    }
    public function allTestPassed() {
      return $this->lengthCheckPassed && $this->capitalCheckPassed
        && $this->nonCapitalCheckPassed && $this->numberCheckPassed
        && $this->specialCharCheckPassed && $this->punctuationCheckPassed;
    }
  }
