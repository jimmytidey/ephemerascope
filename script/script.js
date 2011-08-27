Scope = new Object(); 

Scope.apiEndPoint = '/ephemerascope/api/index.php';
Scope.pointsLat = new Array();
Scope.pointsLng = new Array();
Scope.wayPoints = new Array();

Scope.scan = function() {
	Scope.scanApi();
}

Scope.scanTweets = function() {
	
} 


//adds everything apart from Twitter, which I'm doing separately 
Scope.scanApi = function() {
	
	//remove any previous info 
	Scope.map.removeAllMarkers();
	Scope.map.removeAllPolylines()
	Scope.wayPoints.length = 0;
	Scope.pointsLat.length = 0;
	Scope.pointsLng.length = 0;
	
	//put up a loader gif 
	$('#loader').html('<img src="resources/ajax-loader.gif" alt="loader" />');
	
	//zoom in beacuse we can only search a small area 
	Scope.map.setZoom(16);
	
	Scope.mapCenter = Scope.map.getCenter(); 
	
	var url = Scope.apiEndPoint+'?lat='+Scope.mapCenter.lat+'&lng='+Scope.mapCenter.lng; 
	$.getJSON(url, function(data) {
		
		$('#loader').html('');
		
		Scope.apiData = eval(data);
		
		//foursquare tips 
		$.each(Scope.apiData['fourSquareTips'], function(index, value) { 
			Scope.addMarker(value.lat, value.lng, value['name']); 	
			Scope.pointsLat.push(value.lat);
			Scope.pointsLng.push(value.lng);
		});

		//flickr 
		$.each(Scope.apiData['flickr'], function(index, value) { 
			Scope.addMarker(value.lat, value.lng, "<img src='"+value['url']+"' height='140' />"); 	
			Scope.pointsLat.push(value.lat);
			Scope.pointsLng.push(value.lng);	
		});
	
		Scope.getDirections(); 
	
	});	
	
} 


Scope.getDirections = function()  {

	//work out some way points 
	Scope.wayPoints[0] = Scope.pointsLat.min()+","+Scope.pointsLng.min(); 
	Scope.wayPoints[1] = Scope.pointsLat.min()+","+Scope.pointsLng.max(); 
	Scope.wayPoints[2] = Scope.pointsLat.max()+","+Scope.pointsLng.max(); 
	Scope.wayPoints[3] = Scope.pointsLat.max()+","+Scope.pointsLng.min(); 
	Scope.wayPoints[4] = Scope.pointsLat.min()+","+Scope.pointsLng.min(); 
	
	var directionsEndPoint = "api/directions.php?";
	var wayPointString = Scope.wayPoints.join('|');
	 
	var directionsQuery ="origin="+Scope.wayPoints[0]+"&destination="+Scope.wayPoints[3]+"&waypoints="+wayPointString+"&sensor=true";
	var directionsUrl = directionsEndPoint + directionsQuery; 
	
	$.getJSON(directionsUrl,  function(directionsData) {
		Scope.directionsData = eval(directionsData);
		
		var waypoints = new Array();
		
		$.each(Scope.directionsData['routes'][0]['legs'], function(index, value) { 
		 	waypoints.push(new LatLonPoint(value['start_location']['lat'], value['start_location']['lng']));
		});
		
		var myPoly = new Polyline(waypoints);
		
		Scope.map.addPolyline(myPoly);
	});
	


}


Scope.drawLocationMap = function(position) {	
	
	
	//get the coords 
    Scope.lat =  position.coords.latitude;
    Scope.lng =  position.coords.longitude;	

	Scope.map = new Mapstraction('map_canvas', 'openstreetmap');

	var myPoint = new LatLonPoint(Scope.lat, Scope.lng);

	Scope.map.setCenterAndZoom(myPoint, 15);

	Scope.map.addControls({
		pan: true, 
		zoom: 'small',
		map_type: true 
	});	

}

Scope.drawLondonMap = function() {	
	
	//get the coords 
    Scope.lat =  '51.5001524';  
    Scope.lng =  '-0.1262362';	

	Scope.map = new Mapstraction('map_canvas', 'openstreetmap');

	var myPoint = new LatLonPoint(Scope.lat, Scope.lng);

	Scope.map.setCenterAndZoom(myPoint, 14);

	Scope.map.addControls({
		pan: true, 
		zoom: 'small',
		map_type: true 
	});	

}

//initialise page 
$('#home_page').live('pageshow', function() { 
	
	if (navigator.geolocation) {
	
	    navigator.geolocation.getCurrentPosition(
	        function(position) {
				alert('sucess');
	        },
	        function errorCallback(error) {
				alert("Your HTML 5 geolocation isn't woking");
				Scope.drawLondonMap(); 
	        },
	        {
	            maximumAge:Infinity,
	            timeout:1000
	        }
	    );

	} 

	else {
		alert("Your HTML 5 geolocation isn't woking");
		Scope.drawLondonMap();
	}	


	$('#wine_glass').click(function() {
		Scope.scan();
	});
});		


Scope.addMarker = function advancedMarker(lat, lng, info) {
	Scope.map.addMarkerWithData(new mxn.Marker( new mxn.LatLonPoint(lat, lng)),{
        infoBubble : info,
        label : info,
        date : "new Date()",
        marker : 4,
        iconShadow: "resources/marker_shadow.png",
        iconShadowSize : [0,0],
        icon : "resources/blue_marker.png",
        iconSize : [20,20],
        draggable : false,
        hover : true
    });
    
}


Array.prototype.max = function() {
	var max = this[0];
	var len = this.length;
	for (var i = 1; i < len; i++) if (this[i] > max) max = this[i];
	return max;
}

Array.prototype.min = function() {
	var min = this[0];
	var len = this.length;
	for (var i = 1; i < len; i++) if (this[i] < min) min = this[i];
	return min;
}

 