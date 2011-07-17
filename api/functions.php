<?

function fourSquareCheckins($lat, $lng) {

	$api_key['client_id'] = 'G0NWAS1PB1W0YFU1K0XCRV1MINS2SMCGQT2UQVLFVNA0VOPO';
	$api_key['client_secret'] = 'BLKD4BER4VFW0TCLAHQ4KLQI5MBMNVMZTYHLELRXBEBSBB25'; 
		
	//return foursquare venues 
	$foursquare_venues_url = 'https://api.foursquare.com/v2/venues/search';
	$query_url = $foursquare_venues_url."?ll=$lat,$lng&client_id=".$api_key['client_id']."&client_secret=".$api_key['client_secret'];	
	$result = urlToJson($query_url);
	$trimmed_result = $result->response->groups['0']->items;
	
	$foursquare = array(); 
	$result = array();
	
	foreach($trimmed_result as $group) {
		$result['id']	 			= $group->id;
		$result['name']	 			= $group->name;
		//$result['address'] 			= $group->location->address; Why doesn't this work?
		$result['lat'] 				= $group->location->lat;
		$result['lng'] 				= $group->location->lng; 
		$result['checkin_count']	= $group->stats->checkinsCount;		 
		
		$foursquare[] = $result;  
	}
	
	return $foursquare; 
	
}

function fourSquareTips($lat, $lng) {

	$api_key['client_id'] = 'G0NWAS1PB1W0YFU1K0XCRV1MINS2SMCGQT2UQVLFVNA0VOPO';
	$api_key['client_secret'] = 'BLKD4BER4VFW0TCLAHQ4KLQI5MBMNVMZTYHLELRXBEBSBB25'; 
		
	//return foursquare venues 
	$foursquare_venues_url = 'https://api.foursquare.com/v2/tips/search';
	$query_url = $foursquare_venues_url."?ll=$lat,$lng&client_id=".$api_key['client_id']."&client_secret=".$api_key['client_secret'];	
	$result = urlToJson($query_url);
	

	$trimmed_result = $result->response->tips;
		
	$foursquare = array(); 
	$result = array();
	
	foreach($trimmed_result as $tip) {
		$result['id']	 				= $tip->id;
		$result['name']	 				= $tip->text;
		$result['created_at']	 		= $tip->createdAt;
		//$result['location_address'] 	= $tip->venue->location->address;
		$result['lat'] 					= $tip->venue->location->lat;
		$result['lng'] 					= $tip->venue->location->lng; 
		$result['venue_id']				= $tip->venue->id;		 
		
		$foursquare[] = $result;  
	}
	
	return $foursquare; 
	
}


function flickr($lat, $lng) {
	$api_key['key'] 	= "0989f78544fb0ab54b3c8d1b65a4258f";
	$api_key['secret'] 	= "0812e795318315df";
	
	$a_year_ago = time()-15556926; 
	
	$flickr_url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=".$api_key['key'] ;
	
	$query_url = $flickr_url."&lat=$lat&lon=$lng&radius=1&extras=description%2C+url_m%2C+geo%2Cdate_taken%2C+owner_name%2C&min_taken_date=$a_year_ago&format=json&nojsoncallback=1";	
	
	$result = urlToJson($query_url);
	
	$trimmed_result = $result->photos->photo;
		
	$flickr = array(); 
	$result = array();
	
	//print_r($trimmed_result);
	
	foreach($trimmed_result as $photos) {
		$result['id']	 				= $photos->id;
		$result['title']	 			= $photos->title;
		$result['description']			= $photos->description->_content;			
		$result['url'] 					= $photos->url_m;
		$result['lat'] 					= $photos->latitude;
		$result['lng'] 					= $photos->longitude; 
		$result['date']					= $photos->datetaken;
		$result['owner']				= $photos->ownername;				 
		
		$flickr[] = $result;  
	}	
	
	return($flickr);
} 


function twitter($lat, $lng) {
	
	
}

	

function urlToJson($url) 
{	
	

	$ch = curl_init();
	
	// set URL to download
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); //apparently there is something about MAMP that means it can't verify these things... 
	// should curl return or print the data? true = return, false = print
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
	// timeout in seconds
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	
	// download the given URL, and return output
	$output = curl_exec($ch);
	return json_decode($output);
}


?>