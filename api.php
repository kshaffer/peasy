<?PHP
header("Access-Control-Allow-Origin: *");
header('Content-Type: text/plain');
$df = fopen('syllabus.json', 'r');
$data = fread($df, filesize('syllabus.json'));
echo $data;
?>
