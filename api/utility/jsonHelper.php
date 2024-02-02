<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/classes/data/EncodedImage.php';    //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/classes/data/community/Post.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/classes/data/EssentialUserData.php';  //NOSONAR
  require_once $_SERVER['DOCUMENT_ROOT'] . '/api/utility/classes/data/UserData.php';  //NOSONAR

  define("USER_SELF", 0);
  define("USER_FRIEND", 0);
  define("USER_STRANGER", 0);
  define("USER_CONTENT_FOLDER", 0);

  function jsonToRegistration($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      return new UserData($assArray['username'], $assArray['email'],
      $assArray['password'], $assArray['firstname'], $assArray['lastname'],
      $assArray['gender'], $assArray['biography'], $assArray['personalwebsite'],
      $assArray['pfp'], $assArray['phonenumbers']);
    } else {
      throw new ApiError("Ok", 200, "Invalid user data", 401);
    }
  }
  function jsonToLogin($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      return new EssentialUserData($assArray['username'], $assArray['email'],
      $assArray['password']);
    } else {
      throw new ApiError("Ok", 200, "Invalid user data", 401);
    }
  }

  function jsonToCommunity($jsonString) {
    $assArray = json_decode($jsonString, true);
    if ($assArray !== null) {
      $communityName = attemptValExtraction($assArray, 'name');
      $communityImage = attemptValExtraction($assArray, 'image');
      $communityDescription = attemptValExtraction($assArray, 'description');
      return new Community($communityName, $communityDescription, $communityImage);
    } else {
      throw new ApiError("Ok", 200, "Invalid user data", 401);
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
      $postImageUrl = attemptValExtraction($assArray, 'image');    // TODO: Conversion to image!!!!
      $postId = attemptValExtraction($assArray, 'id');
      return new Post($postDate, $postContent, $postTitle, $postName, $postUsername, $postImageUrl, $postId);
    } else {
      throw new ApiError("Ok", 200, "Invalid user data", 401);
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
      throw new ApiError("Ok", 200, "Invalid user data", 401);
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
      case USER_FRIEND:                                               //NOSONAR
        $userJson->phonenumbers = $userContainer->getPhoneNumbers();
        $userJson->email = $userContainer->getEmail();
      case USER_STRANGER:
        $userJson->pfp = $userContainer->getPfp();
        $userJson->gender = $userContainer->getGender();
        $userJson->username = $userContainer->getUsername();
        $userJson->biography = $userContainer->getBiography();
        $userJson->personalwebsite = $userContainer->getPersonalWebsite();
    }
    return $userJson;
  }

  function attemptValExtraction($associativeArray, $key, $nonPresentReturn = null) {
    return array_key_exists($key, $associativeArray)
      ? $associativeArray[$key]
      : $nonPresentReturn;
  }

  function decodeAndStoreImage(EncodedImage $image, $prefix = "img-") {
    $decodedImage = base64_decode($image->getEncodedImageString());
    $fileId = null;
    $fullFilePath = null;
    do {
      $fileId = uniqid($prefix);
      $fullFilePath = USER_CONTENT_FOLDER . $fileId . "." . $image->getExtension();
    } while (file_exists($fullFilePath));
    file_put_contents($fullFilePath, $decodedImage);
    return $fullFilePath;
  }
