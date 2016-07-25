<?php
   $json = $_POST['data'];
   $file = fopen('meta.json','wb');
   fwrite($file, $json);
   fclose($file);
?>
