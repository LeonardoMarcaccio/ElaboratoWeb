<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/user.php'; //NOSONAR

  function checkUsernameValidity($username) {

  }
  function checkPasswordValidity($password) {

  }
  function checkEmailValidity($email) {

  }
  function checkMainCredentialsValidity(User $credentialContainer) {
    checkUsernameValidity($credentialContainer->email);
  }
  function checkSecondaryCredentialsValidity($credentialContainer) {

  }
  function checkFullCredentialsValidity($credentialContainer) {
    checkMainCredentialsValidity($credentialContainer);
    checkSecondaryCredentialsValidity($credentialContainer);
  }
