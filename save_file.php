<?php
   $json = $_POST['data'];
   $file = fopen('syllabus.json','wb');
   fwrite($file, $json);
   fclose($file);
?>
