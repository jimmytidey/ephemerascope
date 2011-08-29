<? include ("api/api_keys.php") ?>

<!DOCTYPE html> 
<html> 

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
	
    <title>Ephemerascope</title> 
	
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.css" />
	<link rel="stylesheet" href="style/style.css" />

    <script src="http://code.jquery.com/jquery-1.6.1.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.js"></script>
	<script src="script/script.js"></script>

    <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=true&amp;key=<?=$google_maps_key?>" type="text/javascript"></script>

	<script src="script/mapstraction.js"></script>

</head> 


<body> 

<div data-role="page" id='home_page'>

	<div data-role="content">	
		
		<center>
			<a data-role="button" data-inline="true" id='wine_glass'>Wine Glass</a>
			<div id="loader"></div>
		</center>
		
		<div id="map_canvas"></div>
		
		<div id='directions'></div>
			
	</div><!-- /content -->
	
	<div data-role="footer">
		<h4>Ephemera-scope</h4>
	</div><!-- /footer -->
	
</div><!-- /page -->

</body>
</html>