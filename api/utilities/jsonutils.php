<?php

use function PHPSTORM_META\type;

  require_once $_SERVER['DOCUMENT_ROOT'] . "/api/classes/ApiError.php";   //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/data/EncodedImage.php';    //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/data/community/Post.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/data/EssentialUserData.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/data/UserData.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/data/community/Community.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/classes/data/community/Comment.php';  //NOSONAR

  define("USER_SELF", 0);
  define("USER_FRIEND", 0);
  define("USER_FRIEND_PENDING", 0);
  define("USER_STRANGER", 0);
  define("USER_CONTENT_FOLDER", "/media/users/");
  define("SUPPORTED_IMAGE_FORMATS", array("jpg", "png", "gif", "webp"));

  function getInvalidDataError() {
    return new ApiError("Ok", 200, API_INVALID_USER_DATA_ERROR, API_INVALID_USER_DATA_ERROR_CODE);
  }

  function jsonToImage($jsonObject) {
    if ($jsonObject !== null) {
      return new EncodedImage(
        attemptValExtraction($jsonObject, 'image'),
        attemptValExtraction($jsonObject, 'format')
      );
    } else {
      throw getInvalidDataError();
    }
  }

  function jsonToRegistration($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      return new UserData(
        attemptValExtraction($assArray, 'username'),
        attemptValExtraction($assArray, 'email'),
        attemptValExtraction($assArray, 'password'),
        attemptValExtraction($assArray, 'firstname'),
        attemptValExtraction($assArray, 'lastname'),
        attemptValExtraction($assArray, 'gender'),
        attemptValExtraction($assArray, 'biography'),
        attemptValExtraction($assArray, 'personalwebsite'),
        decodeAndStoreImage(jsonToImage(attemptValExtraction($assArray, 'pfp'))),
        attemptValExtraction($assArray, 'phonenumbers'));
    } else {
      throw getInvalidDataError();
    }
  }

  function jsonToLogin($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      return new EssentialUserData($assArray['username'], null, $assArray['password']);
    } else {
      throw getInvalidDataError();
    }
  }

  function jsonToCommunity($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      $communityName = attemptValExtraction($assArray, 'name');
      $communityImage = decodeAndStoreImage(jsonToImage(attemptValExtraction($assArray, 'communityImage')));
      $communityDescription = attemptValExtraction($assArray, 'description');
      return new Community($communityName, $communityDescription, $communityImage);
    } else {
      throw getInvalidDataError();
    }
  }

  function jsonToPost($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      $postDate = attemptValExtraction($assArray, 'date');
      $postContent = attemptValExtraction($assArray, 'content');
      $postTitle = attemptValExtraction($assArray, 'title');
      $postName = attemptValExtraction($assArray, 'name');
      $postUsername = attemptValExtraction($assArray, 'username');
      $postImageUrl = decodeAndStoreImage(jsonToImage(attemptValExtraction($assArray, 'postImage')));
      $postId = attemptValExtraction($assArray, 'id');
      return new Post($postDate, $postContent, $postTitle, $postName, $postUsername, $postImageUrl, $postId);
    } else {
      throw getInvalidDataError();
    }
  }

  function jsonToComment($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      $commentDate = attemptValExtraction($assArray, 'date');
      $commentContent = attemptValExtraction($assArray, 'content');
      $commentUsername = attemptValExtraction($assArray, 'username');
      $commentId = attemptValExtraction($assArray, 'id');
      return new Comment($commentDate, $commentContent, $commentUsername, $commentId);
    } else {
      throw getInvalidDataError();
    }
  }
    
  function generateJSONResponse($code, $message, $data = null, $dataName = "response") {
    $jsonObject = new stdClass();
    $jsonObject->code = $code;
    $jsonObject->message = $message;
    if ($dataName != null && $data != null) {
      $jsonObject->{$dataName} = $data;
    }
    return json_encode($jsonObject);
  }

  function gatherJsonInfo(UserData $userContainer, $infoLevel = USER_STRANGER) {
    $userJson = new stdClass();
    switch($infoLevel) {                                              //NOSONAR
      case USER_SELF:                                                 //NOSONAR
        $userJson->firstname = $userContainer->getFirstName();
        $userJson->lastname = $userContainer->getLastName();
        $userJson->friendship = "self";
      case USER_FRIEND:                                               //NOSONAR
        $userJson->phonenumbers = $userContainer->getPhoneNumbers();
        $userJson->email = $userContainer->getEmail();
        $userJson->friendship = "friends";
      case USER_FRIEND_PENDING:                                       //NOSONAR
        $userJson->friendship = isset($userJson->friendship)
          ? $userJson->friendship
          : "pending";
      case USER_STRANGER:
        $userJson->pfp = $userContainer->getPfp();
        $userJson->gender = $userContainer->getGender();
        $userJson->username = $userContainer->getUsername();
        $userJson->biography = $userContainer->getBiography();
        $userJson->personalwebsite = $userContainer->getPersonalWebsite();
        $userJson->friendship = isset($userJson->friendship)
          ? $userJson->friendship
          : "no";
    }
    return $userJson;
  }

  function attemptValExtraction($associativeArray, $key, $nonPresentReturn = null) {
    return array_key_exists($key, $associativeArray)
      ? $associativeArray[$key]
      : $nonPresentReturn;
  }

  function decodeAndStoreImage($image, $prefix = "img-") {
    if (is_a($image, 'EncodedImage')) {
      if (!in_array($image->getExtension(), SUPPORTED_IMAGE_FORMATS)) {
        return null;
      }
      $decodedImage = base64_decode($image->getEncodedImageString());
      if ($decodedImage === null) {
        return $decodedImage;
      }
      $fileId = null;
      $fullFilePath = null;
      do {
        $fileId = uniqid($prefix);
        $fullFilePath = USER_CONTENT_FOLDER . $fileId . "." . $image->getExtension();
      } while (file_exists($fullFilePath));
      file_put_contents($fullFilePath, $decodedImage);
      return $fullFilePath;
    }
    return null;
  }

  function getImageIfValid($imgJson) {
    if($imgJson === false) {
      $image = attemptValExtraction($imgJson, 'image');
      $extension = attemptValExtraction($imgJson, 'extension');
      $imgUrl = decodeAndStoreImage(new EncodedImage($image, $extension));
      if (filter_var($imgUrl, FILTER_VALIDATE_URL)) {
        return $imgUrl;
      }
    }
    return null;
}
