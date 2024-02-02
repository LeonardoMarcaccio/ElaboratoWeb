<?php
  abstract class ComplianceTest implements JsonSerializable {
    private function __construct(){}

    abstract public function allTestPassed();
    public function jsonSerialize() {
      return ['allTestsPassed' => $this->allTestPassed()];
    }
  }
