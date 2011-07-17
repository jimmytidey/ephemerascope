<?

function fourSquare($lat, $lng) {

	
	$api_key['client_id'] = 'G0NWAS1PB1W0YFU1K0XCRV1MINS2SMCGQT2UQVLFVNA0VOPO';
	$api_key['client_secret'] = 'BLKD4BER4VFW0TCLAHQ4KLQI5MBMNVMZTYHLELRXBEBSBB25'; 
		
	//return foursquare venues 
	$foursquare_venues_url = 'https://api.foursquare.com/v2/venues/search';
	$query_url = $foursquare_venues_url."?ll=$lat,$lng&client_id=".$api_key['client_id']."&client_secret=".$api_key['client_secret'];	
	urlToJson($query_url);
	
		
}

function urlToJson($url) 
{
	print_r($url);

	echo ('sdf')
	//echo $url;
	$ch = curl_init(); 	
	
	// set URL to download
	curl_setopt($ch, CURLOPT_URL, $url);
	
	
	// should curl return or print the data? true = return, false = print
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
	// timeout in seconds
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	
	// download the given URL, and return output
	$output = curl_exec($ch);
	
	print_r($output);
	
}


?>