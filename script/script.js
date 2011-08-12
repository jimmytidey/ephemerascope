Scope = new Object(); 

Scope.apiEndPoint = '/ephemerascope/api/index.php';


Scope.scan = function() {
	Scope.scanTweets();
	Scope.scanApi();
}

Scope.scanTweets = function() {
	
} 


//adds everything apart from Twitter, which I'm doing separately 
Scope.scanApi = function() {
	var url = Scope.apiEndPoint+'?lat='+Scope.lat+'&lng='+Scope.lng; 
	$.getJSON(url, function(data) {
		
		Scope.apiData = eval(data);
		
		//foursquare tips 
		$.each(Scope.apiData['fourSquareTips'], function(index, value) { 
			Scope.addMarker(value.lat, value.lng, value['name']); 		
		});

		//flickr 
		$.each(Scope.apiData['flickr'], function(index, value) { 
			Scope.addMarker(value.lat, value.lng, "<img src='"+value['url']+"' height='140' />"); 		
		});
		
	});	
} 


Scope.drawMap = function(position) {	
	
	//get the coords 
    Scope.lat =  position.coords.latitude;
    Scope.lng =  position.coords.longitude;	

	Scope.map = new Mapstraction('map_canvas', 'openstreetmap');

	var myPoint = new LatLonPoint(Scope.lat, Scope.lng);

	Scope.map.setCenterAndZoom(myPoint, 17);

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


Scope.addMarker = function advancedMarker(lat, lng, info) {
	Scope.map.addMarkerWithData(new mxn.Marker( new mxn.LatLonPoint(lat, lng)),{
        infoBubble : info,
        label : info,
        date : "new Date()",
        marker : 4,
        iconShadow: "http://mapufacture.com/images/providers/blank.png",
        iconShadowSize : [0,0],
        icon : "http://assets1.mapufacture.com/images/markers/usgs_marker.png",
        iconSize : [20,20],
        draggable : false,
        hover : true
    });
    
}

 