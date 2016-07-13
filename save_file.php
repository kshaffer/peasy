<?php
   $json = $_POST['post_object'];

   /* sanity check */
   //if (json_decode($json) != null)
   //{
     $file = fopen('data_write.json','w');
     fwrite($file, $json);
     fclose($file);
   //}
   //else
   //{
     // user has posted invalid JSON, handle the error
  //   fwrite($file, $json);
  //   fclose($file);

   //}
?>
