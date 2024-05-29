<?php

  class Notification implements JsonSerializable {
    private $username;           // Non Essential
    private $code;               // Non Essential
    private $text;               // Non Essential

    public function __construct(  //NOSONAR
      $username = null,
      $code = null,
      $text = null
      ) {
      $this->username = $username;
      $this->code = $code;
      $this->text = $text;
    }

    public function getUsername() {
      return $this->username;
    }
    public function setUsername($username) {
      $this->username = $username;
    }
    public function getCode() {
      return $this->code;
    }
    public function setCode($code) {
      $this->code = $code;
    }
    public function getText() {
      return $this->text;
    }
    public function setText($text) {
      $this->text = $text;
    }

    public function jsonSerialize(): mixed {
        return [
            'username' => $this->username,
            'code' => $this->code,
            'text' => $this->text
        ];
    }
  }
