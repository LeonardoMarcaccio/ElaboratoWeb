<?php
  function sanitizeInput($usrInput) {
    return htmlspecialchars(strip_tags($usrInput), ENT_QUOTES, 'UTF-8');
  }
  function generateToken($length = 32) {
    return uniqid("", true);
  }
