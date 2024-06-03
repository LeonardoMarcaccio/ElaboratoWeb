<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/reports/ComplianceTest.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/reports/EmailValidityReport.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/reports/FullComplianceReport.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/reports/NonEssentialValidityReport.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/reports/PasswordValidityReport.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/reports/UsernameValidityReport.php';  //NOSONAR

  function standardStringValidity($stringToCheck, $maximumLength = null, $mustNotMatchRegex = null) {
    $result = false;
    if ($maximumLength !== null) {
      $result = $result || (strlen($stringToCheck) < $maximumLength);
    }
    if ($mustNotMatchRegex !== null) {
      $pregMatchRes = preg_match($mustNotMatchRegex, $stringToCheck);
      $result = $result || ($pregMatchRes !== 1 && $pregMatchRes !== false);
    }
    return $result;
  }
  function checkUsernameValidity($username) {
    // Length check & no punctuation check
    return new UsernameValidityReport(standardStringValidity($username, 50),
      standardStringValidity($username, null, '/[!@#$%^&*(),.?":{}|<>]/')); // NOSONAR
  }

  function checkPasswordValidity($password) {
    // Length check
    $lengthCheck = strlen($password) > 8;
    // Capital check
    $capitalCheck = preg_match('/[A-Z]/', $password) > 0;
    // Non-capital check
    $nonCapitalCheck = preg_match('/[a-z]/', $password) > 0;
    // Number check
    $numberCheck = preg_match('/\d/', $password) > 0;
    // SpecialChar check
    $specialCharCheck = preg_match('/[^a-zA-Z0-9]/', $password) > 0;
    // Punctuation check
    $punctuationCheck = preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password) > 0;
    // Se la password supera tutti i controlli, è considerata sicura
    return new PasswordValidityReport($lengthCheck,
        $capitalCheck,
        $nonCapitalCheck,
        $numberCheck,
        $specialCharCheck,
        $punctuationCheck);
  }

  function checkEmailValidity($email) {
    return new EmailValidityReport(filter_var($email, FILTER_VALIDATE_EMAIL) !== false);
  }

  function isValidPhoneNumber($phoneNumber) {
    // Rimuovi spazi, trattini e parentesi dalla stringa
    $cleanedNumber = preg_replace('/[\s\-()]/', '', $phoneNumber);

    // Verifica che il numero sia composto solo da cifre e, opzionalmente, inizi con un "+"
    return preg_match('/^\+?[0-9]{10,15}$/', $cleanedNumber);
  }

  function checkNonEssValidity(UserData $userContainer) {
    $lengthName = 50;
    $lengthDesc = 500;
    $lengthPfp = 2083;
    $firstNameCheck = standardStringValidity($userContainer->getFirstName(), $lengthName,
      '/[!@#$%^&*(),.?":{}|<>]/');
    $lastNameCheck = standardStringValidity($userContainer->getLastName(), $lengthName,
      '/[!@#$%^&*(),.?":{}|<>]/');
    $genderCheck = true;
    $biographyValid = standardStringValidity($userContainer->getBiography(), $lengthDesc);
    $personalWebsiteCheck = standardStringValidity($userContainer->getPersonalWebsite(), $lengthDesc);
    if ($userContainer->getPfp() == null) {
      $profilePicCheck = true;
    } else {
      $profilePicCheck = standardStringValidity($userContainer->getPfp(), $lengthPfp);
    }
    $phoneNumberCheck = isValidPhoneNumber($userContainer->getPhoneNumbers());

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
