<?php
  $credentials = json_decode($_POST['data']);
  if(isset($credentials->action) && $credentials->action == "authenticate") {
    $df = fopen('user_db/db.json', 'r');
    $datafile = fread($df, filesize('user_db/db.json'));
    $auth = json_decode($datafile);
    $credentialsAreValid = 0;
    if($auth->username == $credentials->username && $auth->password == $credentials->password) {
      $credentialsAreValid = 1;
    }
    //error_log(strval($credentialsAreValid), 3, 'error_log');
    //echo strval($credentialsAreValid);
  }
  echo 'poopy';

/* see secure_part_2.php */

?>
