<?php
  class Community implements JsonSerializable {
    private $name;
    private $description;
    private $image;
    private $id;

    public function __construct($name, $description, $image = null, $id = null) {
      $this->name = $name;
      $this->description = $description;
      $this->image = $image;
      $this->id = $id;
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
    public function getId() {
      return $this->id;
    }

    public function jsonSerialize() {
      return ['communityName' => $this->name,
        'description' => $this->description,
        'image' => $this->image,
        'id' => $this->id];
    }
  }
