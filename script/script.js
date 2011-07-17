var Scope = new Object(); 

//add location properties 
function locate(position) {	

}

//function for harvesting tweets
Scope.getTweets = function() {
	
	
} 

//function for harvesting foursquare tips 
Scope.getFoursquare = function() {
	var client = new FourSquareClient("G0NWAS1PB1W0YFU1K0XCRV1MINS2SMCGQT2UQVLFVNA0VOPO", "BLKD4BER4VFW0TCLAHQ4KLQI5MBMNVMZTYHLELRXBEBSBB25", "http://jimmytidey.co.uk");
	
	client.tipsClient.search(
	       function(response)
	       {
	           alert('hi');
	       },
		51, 0
	);
}


//function for harvesting flickr images 
Scope.getFlickr = function() {
	
	
}

//function for harvesting flickr images 
Scope.getFlickr = function() {
	
	
}
