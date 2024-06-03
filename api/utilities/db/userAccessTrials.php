<?php
  require_once "generalUtils.php";                                    //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR

  function getNumnberOfTries($username, mysqli $database) {
    $query = $database->prepare("SELECT tries FROM useraccesstrials WHERE Username = ?");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw getInternalError();
    }
    
    $trialsNumber = mysqli_fetch_assoc($query->get_result());
    if ($trialsNumber != null) {
      return $trialsNumber;
    } else {
      throw getInternalError();
    }
  }

  function getLastAttemptDate($username, mysqli $database) {
    $query = $database->prepare("SELECT date FROM useraccesstrials WHERE Username = ?");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw getInternalError();
    }
    
    $resultingUser = mysqli_fetch_assoc($query->get_result());
    if ($resultingUser != null) {
      return $resultingUser;
    } else {
      throw getInternalError();
    }
  }

  function addAttempt($username, mysqli $database) {
    $tries = getNumnberOfTries($username, $database) + 1;
    $query = $database->prepare("UPDATE useraccesstrials SET Tries = ?, Date = NOW() WHERE Username = ?");
    $query->bind_param("is", $tries, $username);
    if (!$query->execute()) {
      throw getInternalError();
    }
  }

  function resetTries($username, mysqli $database) {
    $query = $database->prepare("UPDATE useraccesstrials SET Tries = 0, Date = null WHERE Username = ?");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw getInternalError();
    }
  }
