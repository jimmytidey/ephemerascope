<?
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');


include('functions.php');

if (isset($_GET['lat'])) {
	$lat=$_GET['lat']; 
	$lng=$_GET['lng'];  
}

else {
	$lat = '51.5293312';
	$lng = '-0.0559076';
	$json['test_mode'] ='true';
}


$json['fourSquareTips']		= fourSquareTips($lat, $lng);
$json['fourSquareCheckins'] = fourSquareCheckins($lat, $lng);

echo (json_encode($json)); 

?>