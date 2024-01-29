<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/error.php';                  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/jsonhelper.php';             //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/requestcomplianceutils.php'; //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/contentcomplianceutils.php'; //NOSONAR

  try {
    assertRequestMatch('POST');
    $usrObj = jSONtoUser(file_get_contents("php://input"));
    $report = performCredentialReport($usrObj);
    if ($report->allTestPassed()) {
      mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
      $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
      $registrationStatement = $database->prepare(
        "INSERT INTO user (Username, Email, Password, FirstName, LastName, Gender, Biography, PersonalWebsite, Pfp, Phonenumbers)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $username = $usrObj->getUsername();
        $email = $usrObj->getEmail();
        $password = $usrObj->getPassword();
        $password = password_hash($password, PASSWORD_DEFAULT);
        $firstname = $usrObj->getFirstName();
        $lastname = $usrObj->getLastName();
        $gender = $usrObj->getGender();
        $biography = $usrObj->getBiography();
        $personalWebsite = $usrObj->getPersonalWebsite();
        $pfp = $usrObj->getPfp();
        $phoneNumbers = $usrObj->getPhoneNumbers();
        $registrationStatement->bind_param("sssssissss",
        $username, $email, $password, $firstname, $lastname,
        $gender, $biography, $personalWebsite, $pfp, $phoneNumbers);

        if (!$registrationStatement->execute()) {
          throw new ApiError("Internal Server Error", 500,
          "Error while contacting database", 500);
        }
        exit(generateJSONResponse(200, "Ok", generateToken(32), "authToken"));
      }
      exit(generateJSONResponse(401, "Invalid Information", $report));
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  }

