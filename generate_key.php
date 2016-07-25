<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: GET");
header('Content-Type: application/json');
$secretkey = base64_encode(openssl_random_pseudo_bytes(64));
$json_key = json_encode(['secretkey' => $secretkey]);
echo $json_key;
?>
