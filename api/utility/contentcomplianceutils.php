<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/user.php'; //NOSONAR
  require_once 'classes/reports/ComplianceTest.php';                //NOSONAR
  require_once 'classes/reports/EmailValidityReport.php';           //NOSONAR
  require_once 'classes/reports/FullComplianceReport.php';          //NOSONAR
  require_once 'classes/reports/PasswordValidityReport.php';        //NOSONAR
  require_once 'classes/reports/UsernameValidityReport.php';        //NOSONAR
  require_once 'classes/reports/NonEssentialValidityReport.php';    //NOSONAR

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

  function performCredentialReport($usrObj) {
    $passwdValidityReport = checkPasswordValidity($usrObj->getPassword());
    $unameValidityReport = checkUsernameValidity($usrObj->getUsername());
    $emailValidityReport = checkEmailValidity($usrObj->getEmail());
    $nonEssentialDataValidityReport = checkNonEssValidity($usrObj);

    return new FullComplianceReport($emailValidityReport, $passwdValidityReport,
      $unameValidityReport, $nonEssentialDataValidityReport);
  }
