<?php
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/error.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/jsonhelper.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/requestcomplianceutils.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/contentcomplianceutils.php"; //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utility/classes/reports/FullComplianceReport.php"; //NOSONAR

  try {
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    $requestBody = file_get_contents("php://input");
    $result = null;
    switch($_SERVER['REQUEST_METHOD']) {
      case 'POST':
        $result = communityPostRequest($requestBody, $database);
      break;
      case 'GET':
        $result = communityGetRequest();
      break;
    }
    exit(generateJSONResponse(200, "Ok", $result));
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
    $result = null;
    switch($_SERVER['type']) {
      case "community":
        createCommunity($requestBody, $database);
      break;
      case "post":
        //post creation function
        //$result = createCommunityPost($targetCommunity, $requestBody);
      break;
      case "comment":
        //comment creation function
        //$result = createCommunityComment($targetCommentId, $requestBody);
      break;
      case "page":
        //page creation function
        //$result = createCommunityPage($targetCommunityName, $requestBody);
      break;
    }
    return $result;
  }

  function createCommunity($requestBody, mysqli $database) {
    $communityBody = jsonToCommunity($requestBody);
    $statement = $database->prepare("INSERT INTO community (Name, Image, Description, Username) VALUES (?, ?, ?, ?)");
    $statement->bind_param("ssss", $communityBody->getCommunityName(),
      $communityBody->getCommunityImage(),
      $communityBody->getCommunityDescription(),
      getNicknameByToken($_COOKIE["token"], $database));
  }

  function modifyCommunity($requestBody, mysqli $database) {
    $communityBody = jsonToCommunity($requestBody);
    $statement = $database->prepare("UPDATE community SET Image = ?, Description = ? WHERE Name = ?");
    $statement->bind_param(
      "sss",
      $communityBody->getCommunityImage(),
      $communityBody->getCommunityDescription(),
      $communityBody->getCommunityName()
    );
  }

  // FIXME: merge functions
  /*function createCommunity($communityName, $image, $description, $founderUsername, mysqli $database) {
    $query = $database->prepare("INSERT INTO community VALUES(?, ?, ?, ?)");
    $query->bind_param("ssss", $communityName, $image, $description, $founderUsername);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,                
        DB_CONNECTION_ERROR, 500);
    }
  }*/

  function createPost($content, $title, $image, $communityName, $username, mysqli $database) {
    $query = $database->prepare("INSERT INTO community VALUES(NOW(), ?, ?, ?, ?, ?)");
    $query->bind_param("sssss", $content, $title, $image, $communityName, $username);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }
  }

  function modifyComment($requestBody, mysqli $database) {
    $postBody = jsonToPost($requestBody);



    $statement = $database->prepare("UPDATE post SET Date = NOW(), Content = ?, Image = ? WHERE PostID = ?");
    $statement->bind_param(
      "sss",
      $postBody->getContent(),
      $postBody->getImageUrl(),
      $postBody->getId()
    );
  }

  function createComment($postID, $content, $username, mysqli $database) {
    $query = $database->prepare("INSERT INTO comment VALUES(NOW(), ?, ?)");
    $query->bind_param("ss", $content, $username);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }

    $query = $database->prepare("SELECT commentID FROM comment LIMIT 1 WHERE username=? ORDER BY date DESC");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }
    
    $commentID = $query->get_result();
    
    $query = $database->prepare("INSERT INTO answer VALUES(?, ?)");
    $query->bind_param("ss", $commentID, $postID);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }
  }

  
  function createSubcomment($originID, $content, $username, mysqli $database) {
    $query = $database->prepare("INSERT INTO community VALUES(NOW(), ?, ?)");
    $query->bind_param("ss", $content, $username);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }
    
    $query = $database->prepare("SELECT commentID FROM comment LIMIT 1 WHERE username=? ORDER BY date DESC");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }
    
    $commentID = $query->get_result();
    
    $query = $database->prepare("INSERT INTO subcomment VALUES(?, ?)");
    $query->bind_param("ss", $commentID, $originID);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
      DB_CONNECTION_ERROR, 500);
    }
  }

  function modifyPost($requestBody, mysqli $database) {
    $commentBody = jsonToComment($requestBody);
    $statement = $database->prepare("UPDATE comment SET Date = NOW(), Content = ? WHERE CommentID = ?");
    $statement->bind_param(
      "ss",
      $commentBody->getContent(),
      $commentBody->getID()
    );
  }
  
  function communityGetRequest() {
    if(!isset($_SERVER['type'])
      && !isset($_SERVER['target'])) {            //TODO: parametri per pages e maxperpage
      throw new ApiError("Bad Request", 400);
    }
    $result = null;
    switch($_SERVER['type']) {
      case "community":
        //community creation function
        //result = getCommunities($targetCommunityName, $requestBody, $pages, $maxPerPage);
      break;
      case "post":
        //post creation function
        //result = createCommunityPost($targetCommunity, $requestBody, $pages, $maxPerPage);
      break;
      case "comment":
        //comment creation function
        //result = createCommunityComment($targetCommentId, $requestBody, $pages, $maxPerPage);
      break;
      case "page":
        //page creation function
        //result = createCommunityPage($targetCommunityName, $requestBody, $pages, $maxPerPage);
      break;
    }
    return $result;
  }

  function getCommunities($targetCommunityName, $requestBody, $pages, $maxPerPage, mysqli $database) {
    $query = $database->prepare("SELECT * FROM community WHERE name=?");
    $query->bind_param("s", $targetCommunityName);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }
    return $query->get_result();
  }

  function getCommunityPost($targetCommunityName, $requestBody, $pages, $maxPerPage, mysqli $database) {
    $n = $pages*$maxPerPage;
    $query = $database->prepare("SELECT * FROM post LIMIT ? WHERE name=? ORDER BY date DESC");
    $query->bind_param("is", $n, $targetCommunityName);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }

    return $query->get_result();
  }

  function getPostComment($targetPostID, $requestBody, $pages, $maxPerPage, mysqli $database) {
    $n = $pages*$maxPerPage;
    $query = $database->prepare("SELECT * FROM answer LIMIT ? WHERE postID=? ORDER BY date DESC");
    $query->bind_param("is", $n, $targetPostID);
    if (!$query->execute()) {
      throw new ApiError("Internal Server Error", 500,
        DB_CONNECTION_ERROR, 500);
    }

    return $query->get_result();
  }