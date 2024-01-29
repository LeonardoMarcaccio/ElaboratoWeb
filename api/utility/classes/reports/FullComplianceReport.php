<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/classes/user.php'; //NOSONAR
  require_once 'ComplianceTest.php';                //NOSONAR
  require_once 'EmailValidityReport.php';           //NOSONAR
  require_once 'NonEssentialValidityReport.php';    //NOSONAR
  require_once 'PasswordValidityReport.php';        //NOSONAR
  require_once 'UsernameValidityReport.php';        //NOSONAR

  class FullComplianceReport extends ComplianceTest {
    private $emailValidityReport;
    private $passwordValidityReport;
    private $usernameValidityReport;
    private $nonEssentialValidityReport;

    public function __construct($emailValidityReport, $passwordValidityReport,
      $usernameValidityReport, $nonEssentialValidityReport) {
      $this->emailValidityReport = $emailValidityReport;
      $this->passwordValidityReport = $passwordValidityReport;
      $this->usernameValidityReport = $usernameValidityReport;
      $this->nonEssentialValidityReport = $nonEssentialValidityReport;
    }

    public function getEmailValidityReport() {
      return $this->emailValidityReport;
    }
    public function getPasswordValidityReport() {
      return $this->passwordValidityReport;
    }
    public function getUsernameValidityReport() {
      return $this->usernameValidityReport;
    }
    public function nonEssentialValidityReport() {
      return $this->nonEssentialValidityReport;
    }

    public function allTestPassed() {
      return $this->passwordValidityReport->allTestPassed()
        && $this->usernameValidityReport->allTestPassed()
        && $this->emailValidityReport->allTestPassed()
        && $this->nonEssentialValidityReport->allTestPassed();
    }
    public function jsonSerialize() {
      return array_merge(parent::jsonSerialize(),
        ['emailValidityReport' => $this->emailValidityReport,
          'passwordValidityReport' => $this->passwordValidityReport,
          'usernameValidityReport' => $this->usernameValidityReport,
          'nonEssentialValidityReport' => $this->nonEssentialValidityReport]);
    }
  }
