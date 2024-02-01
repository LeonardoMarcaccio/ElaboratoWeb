<?php
  class Comment implements JsonSerializable {
    private $date;
    private $content;
    private $username;
    private $id;

    public function __construct($date, $content, $username, $id = null) {
      $this->date = $date;
      $this->content = $content;
      $this->username = $username;
      $this->id = $id;
    }

    public function getDate() {
      return $this->date;
    }
    public function getContent() {
      return $this->content;
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
        'username' => $this->username,
        'id' => $this->id];
    }
  }
