<?php
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/postUtils.php";     //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/sessionUtils.php";  //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/jsonutils.php";        //NOSONAR

  define("DEFAULT_PAGE_SIZE", 5);
  define("DEFAULT_PAGE_INDEX", 0);

  try {
    $database = new mysqli("localhost", "root", "", "playpal");                   //NOSONAR
    $requestBody = file_get_contents("php://input");
    $result = null;
    switch($_SERVER['REQUEST_METHOD']) {
      case 'POST':
        $result = communityPostRequest($requestBody, $database);
      break;
      case 'GET':
        $result = communityGetRequest($requestBody, $database);
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
    }
    exit(generateJSONResponse(200, "Ok", $result));
  } catch (ApiError $thrownError) {
    header($_SERVER["SERVER_PROTOCOL"] . " " . $thrownError->getCode() . " " . $thrownError->getMessage());
    die(generateJSONResponse($thrownError->getApiErrorCode(), $thrownError->getApiMessage()));
  } finally {
    $database->close();
  }

  function communityPostRequest($requestBody, $database) {
    if(!isset($_GET['type'])) {
      throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    $result = null;
    switch($_GET['type']) {
      case "community":
        //community creation/edit function
        if (isset($_GET['edit'])) {
          modifyCommunity($requestBody, $database);
        } else {
          createCommunity($requestBody, $database);
        }
      break;
      case "post":
        //post creation function
        //$result = createCommunityPost($targetCommunity, $requestBody);
        if (isset($_GET['target'])) {
          createPost($_GET['target'], $requestBody, $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
        }
      break;
      case "comment":
        //comment creation function
        //$result = createCommunityComment($targetCommentId, $requestBody);
        //createComment($requestBody, $database);
      break;
      case "page":
        //page creation function
        //$result = createCommunityPage($targetCommunityName, $requestBody);
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
    }
    return $result;
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
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }

    $query = $database->prepare("SELECT commentID FROM comment LIMIT 1 WHERE username=? ORDER BY date DESC");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
    
    $commentID = $query->get_result();
    
    $query = $database->prepare("INSERT INTO answer VALUES(?, ?)");
    $query->bind_param("ss", $commentID, $postID);
    if (!$query->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
  }

  
  function createSubcomment($originID, $content, $username, mysqli $database) {
    $query = $database->prepare("INSERT INTO community VALUES(NOW(), ?, ?)");
    $query->bind_param("ss", $content, $username);
    if (!$query->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
    
    $query = $database->prepare("SELECT commentID FROM comment LIMIT 1 WHERE username=? ORDER BY date DESC");
    $query->bind_param("s", $username);
    if (!$query->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
    
    $commentID = $query->get_result();
    
    $query = $database->prepare("INSERT INTO subcomment VALUES(?, ?)");
    $query->bind_param("ss", $commentID, $originID);
    if (!$query->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }
  }
  
  /*Cognitive complexity of this function is higher than 15, however
    refractoring it will require a major rework of this module.
    I tried to define better some values to make the code more readable.
  */
  function communityGetRequest($requestBody, $database) {             //NOSONAR
    if(!isset($_GET['type'])) {
        throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    $targetSelected = !isset($_GET['selection']);
    $dividerProvided = !isset($_GET['pageIndex']) && !isset($_GET['pageSize']);
    $result = null;
    $pageSize = DEFAULT_PAGE_SIZE;
    $pageIndex = DEFAULT_PAGE_INDEX;
    $type = $_GET['type'];
    $target = $targetSelected
      ? $_GET['selection']
      : null;
    if ($dividerProvided) {
      $pageSize = $_GET['pageSize'];
      $pageIndex = $_GET['pageIndex'];
    }

    if (isset($_GET['contentId'])) {
      $pageIndex = $_GET['contentId'];
      $pageSize = 1;
    }

    switch($_SERVER['type']) {
      case "community":
        //community getting function
        $result = getCommunities(getUsernameByToken($_COOKIE['token'], $database), $type, $pageIndex, $pageSize, $database);
      break;
      case "post":
        $postList = null;
        //post getting function
        if (!$targetSelected) {
          $postList = getCommunityPost($target, $requestBody, $pageIndex, $pageSize, $database);
        } else {
          //$postList = array(get single post );
        }
        $result = array();
        foreach ($postList as $singlePost) {
          array_push($singlePost, new Post($singlePost['Date'],
            $singlePost['Content'], $singlePost['Title'],
            $singlePost['Name'], $singlePost['Username'],
            $singlePost['Image'], $singlePost['PostID']));
        }
      break;
      case "comment":
        //comment getting function
        if ($targetSelected) {
          $commentList = getPostComment($target, $requestBody, $pageIndex, $pageSize, $database);
        } else {
          //$commentList = array(get single comment );
        }
        $result = array();
        foreach ($commentList as $singleComment) {
          array_push($singlePost, new Comment($singleComment['Date'],
            $singleComment['Content'], $singleComment['Username'],
            $singleComment['CommentID']));
        }
      break;
      case "subcomment":
        //comment getting function
        /*if ($targetSelected) {
          $commentList = ($target, $requestBody, $pageIndex, $pageSize, $database);
        } else {
          //$commentList = array(get single comment );
        }
        $result = array();
        foreach ($commentList as $singleComment) {
          array_push($singlePost, new Comment($singleComment['Date'],
            $singleComment['Content'], $singleComment['Username'],
            $singleComment['CommentID']));
        }*/
      break;
      case "page":
        // TODO: Page functionality
        //page getting function
        //$result = createCommunityPage($targetCommunityName, $requestBody, $pages, $maxPerPage);
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    return $result;
  }

  function getCommunityPost($targetCommunityName, $requestBody, $pages, $maxPerPage, mysqli $database) {
    $n = $pages*$maxPerPage;
    $query = $database->prepare("SELECT * FROM post LIMIT ? WHERE name=? ORDER BY date DESC");
    $query->bind_param("is", $n, $targetCommunityName);
    if (!$query->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }

    return $query->get_result();
  }

  function getPostComment($targetPostID, $requestBody, $pages, $maxPerPage, mysqli $database) {
    $n = $pages*$maxPerPage;
    $query = $database->prepare("SELECT * FROM answer LIMIT ? WHERE postID=? ORDER BY date DESC");
    $query->bind_param("is", $n, $targetPostID);
    if (!$query->execute()) {
      throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, HTTP_INTERNAL_SERVER_ERROR_CODE,
        DB_CONNECTION_ERROR, DB_CONNECTION_ERROR_CODE);
    }

    return $query->get_result();
  }
