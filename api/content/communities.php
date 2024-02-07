<?php
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/postUtils.php";     //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/sessionUtils.php";  //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/jsonutils.php";        //NOSONAR
  include_once $_SERVER['DOCUMENT_ROOT'] . "/api/utilities/db/communityUtils.php";        //NOSONAR

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
        if (isset($_GET['target'])) {
          createComment($_GET['target'], $requestBody, $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
        }
      break;
      case "subcomment":
        if (isset($_GET['target'])) {
          //createSubcomment($_GET['target'], $requestBody, $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
        }
      case "vote":
        if (isset($_GET['target']) && isset($_GET['vote'])) {
          addVote(getUsernameByToken($_COOKIE['token'], $database), $_GET['target'], $_GET['vote'], $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
        }
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR_CODE, HTTP_BAD_REQUEST_ERROR);
    }
    return $result;
  }
  
  /*Cognitive complexity of this function is higher than 15, however
    refractoring it will require a major rework of this module.
    I tried to define better some values to make the code more readable.
  */
  function communityGetRequest($requestBody, $database) {             //NOSONAR
    if(!isset($_GET['type'])) {
        throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    $targetSelected = isset($_GET['target']);
    $dividerProvided = isset($_GET['pageIndex']) && isset($_GET['pageSize']);
    $result = null;
    $pageSize = DEFAULT_PAGE_SIZE;
    $pageIndex = DEFAULT_PAGE_INDEX;
    $type = $_GET['type'];
    $target = $targetSelected
      ? $_GET['target']
      : null;
    if ($dividerProvided) {
      $pageSize = $_GET['pageSize'];
      $pageIndex = $_GET['pageIndex'];
    }

    if (isset($_GET['contentId'])) {
      $pageIndex = $_GET['contentId'];
      $pageSize = 1;
    }

    switch($type) {
      case "community":
        //community getting function
        $result = getCommunities($target, $pageIndex, $pageSize, $database);
      break;
      case "post":
        $postList = null;
        //post getting function
        if (!$targetSelected) {
          //post from community
          $postList = getCommunityPost($target, $requestBody, $pageIndex, $pageSize, $database);
        } else {
          //post from id
          if ($target == "") {
            $postList = getRecentPost($pageSize, getUsernameByToken($_SERVER['token'], $database), $database);
          } else {
            $postList = array(getPost($target, $database));
          }
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
          //comment from post
          $commentList = getPostComment($target, $requestBody, $pageIndex, $pageSize, $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
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
        if ($targetSelected) {
          //subcomment from comment
          $commentList = getSubComment($target, $pageIndex, $pageSize, $database);
        } else {
          throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
        }
        $result = array();
        foreach ($commentList as $singleComment) {
          array_push($singlePost, new Comment($singleComment['Date'],
            $singleComment['Content'], $singleComment['Username'],
            $singleComment['CommentID']));
        }
      break;
      default:
        throw new ApiError(HTTP_BAD_REQUEST_ERROR, HTTP_BAD_REQUEST_ERROR_CODE);
    }
    return $result;
  }
