<?php
  require_once 'ComplianceTest.php';                //NOSONAR

  class EmailValidityReport extends ComplianceTest {
    private $atCheckPassed;

    public function __construct($atCheckPassed) {
      $this->atCheckPassed = $atCheckPassed;
    }

    public function getValidCharacterPassed() {
      return $this->atCheckPassed;
    }

    public function jsonSerialize() {
      return array_merge(parent::jsonSerialize(), 
        ['atCheckPassed' => $this->atCheckPassed]);
    }
    public function allTestPassed() {
      return $this->atCheckPassed;
    }
  }
