<?php
  class Community implements JsonSerializable {
    private $name;
    private $description;
    private $image;

    public function __construct($name, $description, $image) {
      $this->name = $name;
      $this->description = $description;
      $this->image = $image;
    }

    public function getCommunityName() {
      return $this->name;
    }
    public function getCommunityDescription() {
      return $this->description;
    }
    public function getCommunityImage() {
      return $this->image;
    }

    public function jsonSerialize() {
      return ['communityName' => $this->name,
        'description' => $this->description,
        'image' => $this->image];
    }
  }
