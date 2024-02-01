<?php
  require_once '/api/utility/classes/data/EncodedImage.php';                //NOSONAR

  class Community implements JsonSerializable {
    private $communityName;
    private $communityDescription;
    private $communityImage;

    public function __construct($communityName, $communityDescription, EncodedImage $communityImage) {
      $this->communityName = $communityName;
      $this->communityDescription = $communityDescription;
      $this->communityImage = $communityImage;
    }

    public function getCommunityName() {
      return $this->communityName;
    }
    public function getCommunityDescription() {
      return $this->communityDescription;
    }
    public function getCommunityImage() {
      return $this->communityImage;
    }

    public function jsonSerialize() {
      return [$this->communityName, $this->communityDescription,
        $this->communityImage];
    }
  }
