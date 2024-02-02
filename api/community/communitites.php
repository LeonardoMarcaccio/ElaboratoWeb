<?php
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/error.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/jsonhelper.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/requestcomplianceutils.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/contentcomplianceutils.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/classes/reports/FullComplianceReport.php"; //NOSONAR

  try {
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    $requestBody = file_get_contents("php://input");
    switch($_SERVER['REQUEST_METHOD']) {
      case 'POST':
        communityPostRequest($requestBody, $database);
      break;
      case 'GET':
        communityGetRequest();
      break;
    }
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  } finally {
    $database->close();
  }

  function communityPostRequest($requestBody, $database) {
    if(!isset($_SERVER['type'])) {
      throw new ApiError("Bad Request", 400);
    }
    switch($_SERVER['type']) {
      case "community":
        createCommunity($requestBody, $database);
      break;
      case "post":
        //post creation function
        //createCommunityPost($targetCommunity, $requestBody);
      break;
      case "comment":
        //comment creation function
        //createCommunityComment($targetCommentId, $requestBody);
      break;
      case "page":
        //page creation function
        //createCommunityPage($targetCommunityName, $requestBody);
      break;
    }
  }

  function communityGetRequest() {
    if(!isset($_SERVER['type'])
      && !isset($_SERVER['target'])) {
      throw new ApiError("Bad Request", 400);
    }
    switch($_SERVER['type']) {
      case "community":
        //community creation function
        //getCommunities($targetCommunityName, $requestBody, $pages, $maxPerPage);
      break;
      case "post":
        //post creation function
        //createCommunityPost($targetCommunity, $requestBody, $pages, $maxPerPage);
      break;
      case "comment":
        //comment creation function
        //createCommunityComment($targetCommentId, $requestBody, $pages, $maxPerPage);
      break;
      case "page":
        //page creation function
        //createCommunityPage($targetCommunityName, $requestBody, $pages, $maxPerPage);
      break;
    }
  }