<?php
  require_once 'ComplianceTest.php';                //NOSONAR

  class UsernameValidityReport extends ComplianceTest {
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
      return array_merge(parent::jsonSerialize(), [
          'lengthCheckPassed' => $this->lengthCheckPassed,
          'validCharacterPassed' => $this->validCharacterPassed,]);
    }
    public function allTestPassed() {
      return $this->lengthCheckPassed && $this->validCharacterPassed;
    }
  }
