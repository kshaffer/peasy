<?php
   $json = $_POST['data'];
   $file = fopen('data_write.json','wb');
   fwrite($file, $json);
   fclose($file);
?>
