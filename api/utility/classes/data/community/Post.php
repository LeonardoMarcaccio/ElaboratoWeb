<?php
  class Post implements JsonSerializable {
    private $date;
    private $content;
    private $title;
    private $imageUrl;
    private $name;
    private $username;
    private $id;

    public function __construct($date, $content, $title, $name, $username, $imageUrl = null, $id = null) {
      $this->date = $date;
      $this->content = $content;
      $this->title = $title;
      $this->imageUrl = $imageUrl;
      $this->name = $name;
      $this->username = $username;
      $this->id = $id;
    }

    public function getDate() {
      return $this->date;
    }
    public function getContent() {
      return $this->content;
    }
    public function getTitle() {
      return $this->title;
    }
    public function getImageUrl() {
      return $this->imageUrl;
    }
    public function getName() {
      return $this->name;
    }
    public function getUsername() {
      return $this->username;
    }
    public function getId() {
      return $this->id;
    }

    public function jsonSerialize() {
      return ['date' => $this->date,
        'content' => $this->content,
        'title' => $this->title,
        'imageUrl' => $this->imageUrl,
        'name' => $this->name,
        'username' => $this->username,
        'id' => $this->id];
    }
  }
