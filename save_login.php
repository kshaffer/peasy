<?php
   $json = $_POST['data'];
   $file = fopen('config/user_db.json','wb');
   fwrite($file, $json);
   fclose($file);
   chmod('config/user_db.json', 0640);
   chmod('config', 0740);
   header('Content-Type: text/plain');
   echo('success');
?>
