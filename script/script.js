Scope = new Object(); 

Scope.apiEndPoint = '/ephemerascope/api/index.php';


Scope.scan = function() {
	Scope.scanTweets();
	Scope.scanApi();
}

Scope.scanTweets = function() {
	
} 

Scope.scanApi = function() {
	var url = Scope.apiEndPoint+'?lat='+Scope.lat+'&lng='+Scope.lng; 
	$.getJSON(url, function(data) {
		Scope.apiData = eval(data);
		alert('hi');
	});	
} 


Scope.processData = function(data) {
	Scope.locations = eval(data); 

	$.each(Scope.locations, function(key, val) {		
		
		if (val == 'flickr') {
			$.each(val, function(key, val) {
				
				alert(val.date);
			});
		} 
	});
}

Scope.drawMap = function(position) {	
	
	//get the coords 
    Scope.lat =  position.coords.latitude;
    Scope.lng =  position.coords.longitude;	

	Scope.map = new Mapstraction('map_canvas', 'openstreetmap');

	var myPoint = new LatLonPoint(Scope.lat, Scope.lng);

	Scope.map.setCenterAndZoom(myPoint, 13);

	Scope.map.addControls({
		pan: true, 
		zoom: 'small',
		map_type: true 
	});	
	
	Scope.map.isLoaded(Scope.scan());
}


//initialise page 
$('#home_page').live('pageshow', function() { 
	//put the map on the page 

	
	//find out the location 	
	navigator.geolocation.getCurrentPosition(Scope.drawMap);

});		


 