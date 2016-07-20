<?php
   $json = $_POST['data'];
   $file = fopen('site_content.json','wb');
   fwrite($file, $json);
   fclose($file);
?>
