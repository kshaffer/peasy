<?php
  $credentials = json_decode($_POST['data']);
  if(isset($credentials->action) && $credentials->action == "authenticate") {
    $df = fopen('user_db/db.json', 'r');
    $data = fread($df, filesize('user_db/db.json'));
    $auth = json_decode($data);
    if($auth->username == $credentials->username && $auth->password == $credentials->password) {
      $json = $_POST['data'];
      $file = fopen('login_details.json','wb');
      fwrite($file, $json);
      fclose($file);
    } else {
      error_log("Credentials don't match.", 3, "errors.log");
    }
  }


?>
