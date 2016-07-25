<?PHP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: GET");
header('Content-Type: text/plain');
$df = fopen('site_content.json', 'r');
$data = fread($df, filesize('site_content.json'));
echo $data;
?>
