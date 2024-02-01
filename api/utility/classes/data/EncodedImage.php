<?php
  class EncodedImage implements JsonSerializable {
    private $encodedImageString;
    private $extension;

    public function __construct($encodedImageString, $extension) {
      $this->encodedImageString = $encodedImageString;
      $this->extension = $extension;
    }

    public function getEncodedImageString() {
      return $this->encodedImageString;
    }
    public function getExtension() {
      return $this->extension;
    }

    public function jsonSerialize() {
      return [$this->encodedImageString, $this->extension];
    }
  }
