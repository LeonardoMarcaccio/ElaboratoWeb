<?php
  assertRequestMatch('POST');
  $usrObj = jSONtoUser(file_get_contents("php://input"));
  
