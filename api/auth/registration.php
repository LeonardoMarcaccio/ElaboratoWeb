<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/contentcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/requestcomplianceutils.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/jsonutils.php";                //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/sessionUtils.php";          //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/generalUtils.php";          //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";                   //NOSONAR

  $database = null;
  try {
    assertRequestMatch('POST');
    $usrObj = jsonToRegistration(file_get_contents("php://input"));
    $report = performCredentialReport($usrObj);
    if ($report->allTestPassed()) {
      $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
      mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
      if (isValueInColumn("user", "Username", $usrObj->getUsername(), $database)
        || isValueInColumn("user", "Email", $usrObj->getEmail(), $database)) {
          throw new ApiError("Conflict", 409);
      }
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
        $token = generateUniqueToken($database);
        $username = $usrObj->getUsername();
        setcookie("token", $token, DEFAULT_TOKEN_TTL, "/");
        createSession($token, $username, $database);
        exit(generateJSONResponse(200, "Ok"));
      }
      exit(generateJSONResponse(401, "Invalid Information", $report));
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  } finally {
    if ($database !== null) {
      $database->close();
    }
  }
