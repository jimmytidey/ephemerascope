Scope = new Object(); 

Scope.apiEndPoint 	= '/ephemerascope/api/index.php';
Scope.allPoints 	= new Array(); //all the points I retrive from all APIS
Scope.wayPoints	 	= new Array(); //points that are picked out to give to Google directions

Scope.topRight 		= new Array(); //arrays for all the quadrents of all the porints 
Scope.bottomRight 	= new Array();
Scope.bottomLeft 	= new Array();
Scope.topLeft 		= new Array();

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
	Scope.wayPoints.length 		= 0;
	Scope.allPoints.length 		= 0;
	Scope.topRight.length 		= 0;
	Scope.bottomRight.length 	= 0;
	Scope.bottomLeft.length 	= 0;
	Scope.topLeft.length 		= 0;
	
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
			
			value['point_type'] = "foursquare"; 
			
			var lat_sqr = Math.pow(value['lat'] - Scope.mapCenter.lat, 2);
			var lng_sqr = Math.pow(value['lng'] - Scope.mapCenter.lng, 2);
			
			value['radial_distance'] = Math.pow((lat_sqr + lng_sqr), 0.5);
			
			Scope.allPoints.push(value);
		});

		//flickr 
		$.each(Scope.apiData['flickr'], function(index, value) { 
			Scope.addMarker(value.lat, value.lng, "<img src='"+value['url']+"' height='140' />");
			
			value['point_type'] = "flickr";	
			
			var lat_sqr = Math.pow(value['lat'] - Scope.mapCenter.lat, 2);
			var lng_sqr = Math.pow(value['lng'] - Scope.mapCenter.lng, 2);
			
			value['radial_distance'] = Math.pow((lat_sqr + lng_sqr), 0.5);  	
			
			Scope.allPoints.push(value);
		});
	
		Scope.getDirections(); 
	
	});	
	
} 


Scope.getDirections = function()  {
	
	//sort the arrays into quadrants
	$.each(Scope.allPoints, function (index,value) {
		if (value.lat >  Scope.mapCenter.lat && value.lng >  Scope.mapCenter.lng) {Scope.topRight.push(value);}
		if (value.lat <  Scope.mapCenter.lat && value.lng >  Scope.mapCenter.lng) {Scope.bottomRight.push(value);}
		if (value.lat <  Scope.mapCenter.lat && value.lng <  Scope.mapCenter.lng) {Scope.bottomLeft.push(value);}
		if (value.lat >  Scope.mapCenter.lat && value.lng <  Scope.mapCenter.lng) {Scope.topLeft.push(value);}
	}); 

	Scope.topRight.sort(function(a,b) {
		// assuming distance is always a valid integer
		return parseInt(b.distance) - parseInt(a.distance);
	});
	
	Scope.bottomRight.sort(function(a,b) {
		// assuming distance is always a valid integer
		return parseInt(b.distance) - parseInt(a.distance);
	});
	
	Scope.bottomLeft.sort(function(a,b) {
		// assuming distance is always a valid integer
		return parseInt(b.distance) - parseInt(a.distance);
	});

	Scope.topLeft.sort(function(a,b) {
		// assuming distance is always a valid integer
		return parseInt(b.distance) - parseInt(a.distance);
	});	
			
	Scope.wayPoints.push(Scope.topRight[0]['lat']+","+Scope.topRight[0]['lng']);
	Scope.wayPoints.push(Scope.bottomRight[0]['lat']+","+Scope.bottomRight[0]['lng']);
	Scope.wayPoints.push(Scope.bottomLeft[0]['lat']+","+Scope.bottomLeft[0]['lng']);
	Scope.wayPoints.push(Scope.topLeft[0]['lat']+","+Scope.topLeft[0]['lng']);
	
	/*
	//test those markers...
	Scope.addMarker(Scope.topRight[0]['lat'], Scope.topRight[0]['lng'], 'top right');
	Scope.addMarker(Scope.bottomRight[0]['lat'], Scope.bottomRight[0]['lng'], 'bottom right ');
	Scope.addMarker(Scope.bottomLeft[0]['lat'], Scope.bottomLeft[0]['lng'], 'bottom left');
	Scope.addMarker(Scope.topLeft[0]['lat'], Scope.topLeft[0]['lng'], 'top left');
	*/
	
	var wayPointString = escape(Scope.wayPoints.join('|'));
	
	var directionsEndPoint = "api/directions.php?";

	var directionsQuery ="origin="+Scope.wayPoints[0]+"&destination="+Scope.wayPoints[0]+"&waypoints="+wayPointString+"&sensor=true";
	var directionsUrl = directionsEndPoint + directionsQuery; 
	
	$.getJSON(directionsUrl,  function(directionsData) {
		Scope.directionsData = eval(directionsData);
		
		var waypoints = new Array();
		
		$.each(Scope.directionsData['routes'][0]['legs'], function(index, value) { 
	 		$.each(value['steps'], function(index, value) {
				waypoints.push(new LatLonPoint(value['start_location']['lat'], value['start_location']['lng']));
			});
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
				Scope.drawLocationMap(); 
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

 