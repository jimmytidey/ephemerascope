Scope = new Object(); 

Scope.apiEndPoint = '/ephemerascope/api/index.php';


//function for harvesting tweets
Scope.getTweets = function() {

} 

var map = new GMap2(document.getElementById("map_canvas"));

Scope.locate = function(position) {	
	
	//get the coords 
    Scope.lat =  position.coords.latitude;
    Scope.lng =  position.coords.longitude;
	
	//centre the map 
	var myPoint = new LatLonPoint(Scope.lat, Scope.lng);
	Scope.map.setCenterAndZoom(myPoint, 13);
	
	//get some data to put on the maps
	var url = Scope.apiEndPoint+'?lat='+Scope.lat+'&lng='+Scope.lng; 
	$.getJSON(url, function(data) {
		Scope.processData(data);
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

Scope.drawMap = function() {

	Scope.map = new Mapstraction('map_canvas', 'openstreetmap');

	var myPoint = new LatLonPoint(51.456708, -0.101163);

	Scope.map.setCenterAndZoom(myPoint, 13);

	Scope.map.addControls({
		pan: true, 
		zoom: 'small',
		map_type: true 
	});	
}


//initialise page 
$('#home_page').live('pageshow', function() { 
	//put the map on the page 
	Scope.drawMap();
	
	//find out the location 	
	navigator.geolocation.getCurrentPosition(Scope.locate);

});		


 