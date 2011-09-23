
debug = "false";

Scope = new Object(); 

Scope.allPoints 	= new Array(); //all the points I retrive from all APIS
Scope.wayPoints	 	= new Array(); //points that are picked out to give to Google directions

Scope.topRight 		= new Array(); //arrays for all the quadrents of all the porints 
Scope.bottomRight 	= new Array();
Scope.bottomLeft 	= new Array();
Scope.topLeft 		= new Array();

Scope.locatePhotosOnPath 	= new Object(); 
Scope.directions 			= new Object(); 

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
		
	//zoom in beacuse we can only search a small area 
	Scope.map.setZoom(15);
	
	Scope.mapCenter = Scope.map.getCenter(); 

	//remove the current directions 
	$('#directions').html(''); 

	Scope.getFourSquare = function () {
		//put up a loader gif 
		$('#loader').append('<div id="loader_1">Foursquare: <img src="resources/ajax-loader.gif" alt="loader" class="loader"  /></div>');

		var url = 'api/foursquare.php?lat='+Scope.mapCenter.lat+'&lng='+Scope.mapCenter.lng; 
		return $.getJSON(url, function(data) {
		
			$('#loader_1').remove();
		
			Scope.apiFourSquareData = eval(data);
		
			//foursquare tips 
			$.each(Scope.apiFourSquareData.fourSquareTips, function(index, value) { 
				Scope.addMarker(value.lat, value.lng, value['name'], "blue");	
			
				value['point_type'] = "foursquare"; 
			
				var lat_sqr = Math.pow(value['lat'] - Scope.mapCenter.lat, 2);
				var lng_sqr = Math.pow(value['lng'] - Scope.mapCenter.lng, 2);
			
				value['radial_distance'] = Math.pow((lat_sqr + lng_sqr), 0.5);
			
				Scope.allPoints.push(value);
			});
		})	
	}
	
	Scope.getFlickr = function () {
		//put up a loader gif 
		$('#loader').append('<div id="loader_2">Flickr: <img src="resources/ajax-loader.gif" alt="loader" class="loader"  /></div>');	
	
		var url = 'api/flickr.php?lat='+Scope.mapCenter.lat+'&lng='+Scope.mapCenter.lng; 
		return $.getJSON(url, function(data) {
		
			$('#loader_2').remove();
		
			Scope.apiFlickrData = eval(data);

			//flickr 
			$.each(Scope.apiFlickrData, function(index, value) { 
				Scope.addMarker(value.lat, value.lng, "<img src='"+value['url']+"' height='140' />", "red");
			
				value['point_type'] = "flickr";	
			
				var lat_sqr = Math.pow(value['lat'] - Scope.mapCenter.lat, 2);
				var lng_sqr = Math.pow(value['lng'] - Scope.mapCenter.lng, 2);
			
				value['radial_distance'] = Math.pow((lat_sqr + lng_sqr), 0.5);  	
			
				Scope.allPoints.push(value);
			});
		
		});	
	}
	
	
	$.when(Scope.getFourSquare(), Scope.getFlickr())
	   .then(function(){
			alert('hi')
	      Scope.directions.getDirections();
	   })
	   .fail(function(){
	      console.log( 'Ajax requests failed' );
	   });	
	
} 


Scope.directions.getDirections = function() {
	
	//put the loading graphic in 
	$('#directions').append('<div id="loader_4">Directions: <img src="resources/ajax-loader.gif" alt="loader"  /></div>');
	
	//find out what the average distance from the center 
	Scope.aggregateRadialDistance = 0 ; 
	 
	$.each(Scope.allPoints, function (index,value) {
		Scope.aggregateRadialDistance += value.radial_distance;
	});
	
	Scope.averageRadialDistance = Scope.aggregateRadialDistance / Scope.allPoints.length;
	
	//adjust zoom to spread of points 
	if (Scope.averageRadialDistance < 0.5 ) {
		Scope.map.setZoom(16);
	}
	
	if (Scope.averageRadialDistance > 1 ) {
		Scope.map.setZoom(14);
	}	
	
	//set a variable in each array to inicate whether the point is sufficiently close or not 
	$.each(Scope.allPoints, function (index,value) {
		if (value.radial_distance > (2 * Scope.averageRadialDistance)) {
			Scope.allPoints[index]['in_range'] = false;
		}
		
		else {
			Scope.allPoints[index]['in_range'] = true;	
		}
	});
	
	
	//sort any in range points into quadrants
	$.each(Scope.allPoints, function (index,value) {
		if (value.lat >  Scope.mapCenter.lat && value.lng >  Scope.mapCenter.lng && value.in_range) {Scope.topRight.push(value);}
		if (value.lat <  Scope.mapCenter.lat && value.lng >  Scope.mapCenter.lng && value.in_range) {Scope.bottomRight.push(value);}
		if (value.lat <  Scope.mapCenter.lat && value.lng <  Scope.mapCenter.lng && value.in_range) {Scope.bottomLeft.push(value);}
		if (value.lat >  Scope.mapCenter.lat && value.lng <  Scope.mapCenter.lng && value.in_range) {Scope.topLeft.push(value);}
	}); 
	
	//in each quadrent, sort the markers by their radial distance 
	Scope.topRight.sort(function(a,b) {
		var return_val = (b.radial_distance) - (a.radial_distance)
		return (b.radial_distance) - (a.radial_distance);
	});
	
	Scope.bottomRight.sort(function(a,b) {
		// assuming distance is always a valid integer
		return (b.radial_distance) - (a.radial_distance);
	});
	
	Scope.bottomLeft.sort(function(a,b) {
		// assuming distance is always a valid integer
		return (b.radial_distance) - (a.radial_distance);
	});

	Scope.topLeft.sort(function(a,b) {
		// assuming distance is always a valid integer
		return (b.radial_distance) - (a.radial_distance);
	});	
	
	//produce a list of markers that can be handed to the directions API 
	Scope.wayPoints.push(Scope.topRight[0]['lat']+","+Scope.topRight[0]['lng']);
	Scope.wayPoints.push(Scope.bottomRight[0]['lat']+","+Scope.bottomRight[0]['lng']);
	Scope.wayPoints.push(Scope.bottomLeft[0]['lat']+","+Scope.bottomLeft[0]['lng']);
	Scope.wayPoints.push(Scope.topLeft[0]['lat']+","+Scope.topLeft[0]['lng']);
	
	/*
	//test those markers...
	Scope.addMarker(Scope.mapCenter.lat, Scope.mapCenter.lng, 'centre ', "purple");
	Scope.addMarker(Scope.bottomRight[0]['lat'], Scope.bottomRight[0]['lng'], 'bottom right ', "purple");
	Scope.addMarker(Scope.bottomLeft[0]['lat'], Scope.bottomLeft[0]['lng'], 'bottom left', "purple");
	Scope.addMarker(Scope.topLeft[0]['lat'], Scope.topLeft[0]['lng'], 'top left', "purple");
	Scope.addMarker(Scope.topRight[0]['lat'], Scope.topRight[0]['lng'], 'top left', "purple");
	*/
	
	
	//send the markers to the API 
	var wayPointString = escape(Scope.wayPoints.join('|'));
	
	var directionsEndPoint = "api/directions.php?";

	var directionsQuery ="origin="+Scope.mapCenter.lat+","+Scope.mapCenter.lng+"&destination="+Scope.mapCenter.lat+","+Scope.mapCenter.lng+"&waypoints="+wayPointString+"&sensor=true";
	
	var directionsUrl = directionsEndPoint + directionsQuery; 
	
	//send the query
	$.getJSON(directionsUrl,  function(directionsData) {
		
		Scope.directionsData = eval(directionsData);
		
		Scope.directionsPolyline = new Array();
		
		Scope.directions.html = "<div id='directions'>"; //get rid of any existing directions
			
		//loop through each leg of the journey (there is one leg per waypoint)
		$.each(Scope.directionsData['routes'][0]['legs'], function(index, value) { 
	 		
			console.warn("processing a new leg");
			
			//each leg consists of a number of steps 
			$.each(value.steps, function (index, value) {
				
				console.warn("processing a new step"); 
							
				Scope.directionsPolyline.push(new LatLonPoint(value['start_location']['lat'], value['start_location']['lng']));
				
				Scope.directions.html += "<div class='directions_step'><p class='directions_text'>"+ value.html_instructions+"</p>";
					
				//add any photos for this step 
				photos = Scope.locatePhotosOnPath.search(value['start_location']['lat'], value['start_location']['lng'], value['end_location']['lat'], value['end_location']['lng'], value['distance']['value']);
			
				$.each(photos, function (index, value) {
					if (index <15 && value.url ) {
						
						if (value.point_type == 'flickr') {
							Scope.directions.html += "<div class='directions_photos'><p>"+value['title']+" - "+value['description']+"<p><img src='"+value['url']+"'  /></div>";
						}
						
						if (value.point_type == 'foursquare') {
							Scope.directions.html += "<div class='direction_tip'>"+value['name']+"</div>";
						}
					}
				});
			
				Scope.directions.html += "<br style='clear:both'></div>";
			});
			
		}); 
		
		Scope.directions.html += "</div>";
		
		$('#loader_4').remove();
		
		$('#directions').html(Scope.directions.html); 
		
		//draw a line of the route
		Scope.myPoly = new Polyline(Scope.directionsPolyline);
		
		Scope.map.addPolyline(Scope.myPoly);
	});
}



Scope.locatePhotosOnPath.search = function(start_lat, start_lng, end_lat, end_lng, distance) {
  
	Scope.locatePhotosOnPath.return_array = new Array(); 
	
	Scope.locatePhotosOnPath.distance = distance; 

	if (end_lat!= start_lat && end_lng != start_lng) { //use this method if the start and begining coords are not the same 
		
		console.info("Processing as a line");
		
		if (end_lng - start_lng != 0 ) {
			Scope.locatePhotosOnPath.gradient = (end_lat - start_lat) / (end_lng - start_lng); //gcse maths here I come 
		}
		
		else {Scope.locatePhotosOnPath.gradient = 100000;}
		
		if (isNaN(Scope.locatePhotosOnPath.gradient)) {Scope.locatePhotosOnPath.gradient = 0.5; console.info("grad didn't calculate - set to 0.5");};
	
		console.info("gradient = "+ Scope.locatePhotosOnPath.gradient);	
	
		Scope.locatePhotosOnPath.offset = end_lat - (Scope.locatePhotosOnPath.gradient*end_lng); 
		
		console.info("offset = "+ Scope.locatePhotosOnPath.offset); 

		if (debug == "true") {
			var top_left_lat 		= (Scope.locatePhotosOnPath.gradient * start_lng) + (Scope.locatePhotosOnPath.offset + 0.0002);
			var top_right_lat 		= (Scope.locatePhotosOnPath.gradient * end_lng) + (Scope.locatePhotosOnPath.offset + 0.0002);
		
			var bottom_left_lat 	= (Scope.locatePhotosOnPath.gradient * start_lng) + (Scope.locatePhotosOnPath.offset - 0.0002);
			var bottom_right_lat 	= (Scope.locatePhotosOnPath.gradient * end_lng) + (Scope.locatePhotosOnPath.offset - 0.0002);
	 
			Scope.addMarker(top_left_lat , start_lng, 'top left bound', "purple");
			Scope.addMarker(top_right_lat, end_lng, 'top right bound ', "purple");
			Scope.addMarker(bottom_left_lat, start_lng, 'bottom left bound ', "purple");
			Scope.addMarker(bottom_right_lat, end_lng, 'bottom right bound', "purple");
			
			
			// draw a polyline indicating inclusion length 
			var testArray = new Array(); 
		
		
			testArray.push(new LatLonPoint(top_left_lat , start_lng ));
			testArray.push(new LatLonPoint(top_right_lat, end_lng));
			testArray.push(new LatLonPoint(bottom_left_lat, start_lng));
			testArray.push(new LatLonPoint(bottom_right_lat, end_lng));
		
			console.log(testArray);
			
			testPoly = new Polyline(testArray);
		
			Scope.map.addPolyline(testPoly);
		}
		
		$.each(Scope.allPoints, function (index, value) {
		
			if (value.lat > (Scope.locatePhotosOnPath.gradient * value.lng) + Scope.locatePhotosOnPath.offset - 0.0002) { //lower bound 
				if (value.lat < (Scope.locatePhotosOnPath.gradient * value.lng) + Scope.locatePhotosOnPath.offset + 0.0002) { //upper bound 
					if (!value.used) {
						Scope.locatePhotosOnPath.return_array.push(value); 
					
						//indicate this photo has been used so we don't add it twice 
						Scope.allPoints[index]['used'] = true;
					}	 
				}
			}
	
		});
	}
	
	else { //this for processing legs which have identical start and finish points 
		
		console.info("Processing as a point"); 
		
		if (distance == 0 ) {distance = 200;} // 
			
		Scope.locatePhotosOnPath.degree_radius = distance / 104606;
		
		console.info("distance in decimal degress =  "+ Scope.locatePhotosOnPath.degree_radius ); 
		
		$.each(Scope.allPoints, function (index, value) {
			if (index < 10 ) {
				return_array = new Array();
			
				var lat_sqr = Math.pow((start_lat - value.lat),  2);
				var lng_sqr = Math.pow((start_lng - value.lng),  2);
				var radial_disance =  Math.pow(lat_sqr + lng_sqr,  0.5);	

				if (radial_disance < Scope.locatePhotosOnPath.degree_radius) { //lower bound 
					if (!value.used) {
						Scope.locatePhotosOnPath.return_array.push(value); 
					
						//indicate this photo has been used so we don't add it twice 
						Scope.allPoints[index]['used'] = true;
					}	 
				}
			}	
		});
				
	}	
	
	return Scope.locatePhotosOnPath.return_array; 

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
    Scope.lat =  '51.5001522';  
    Scope.lng =  '-0.1262360';	

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
	
	$('#wine_glass').click(function() {
		Scope.scan();
	});
		
	if (navigator.geolocation) {
	
	    navigator.geolocation.getCurrentPosition(
	        function(position) {
				Scope.drawLocationMap(position); 
	        },
	        function errorCallback(error) {
				//alert("Your HTML 5 geolocation isn't woking");
				Scope.drawLondonMap(); 
	        },
	        {
	            maximumAge:Infinity,
	            timeout:1000
	        }
	    );

	} 

	else {
		//	alert("Your HTML 5 geolocation isn't woking");
		Scope.drawLondonMap();
	}	

});		


Scope.addMarker = function advancedMarker(lat, lng, info, colour) {
	Scope.map.addMarkerWithData(new mxn.Marker( new mxn.LatLonPoint(lat, lng)),{
        infoBubble : info,
        label : info,
        date : "new Date()",
        marker : 4,
		shadowIcon : '',
        icon : "resources/"+colour+"_marker.png",
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

 
