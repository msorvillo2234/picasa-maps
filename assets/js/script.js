//xx TODO - wrap Album into class & get pictures
//xx TODO - set center dynamically
//xx TODO - figure out JSON problem with Geocoder API


(function($) {
	var map, geocoder, albums = [];
	
	$(document).ready(function(){
		initMap();
		getAlbums();

	});	
	
	function initMap()
	{
		geocoder = new GClientGeocoder();
		map = new GMap2($("div#map") .get(0));
		map.setCenter(new GLatLng(30, -55), 3);
		map.setUIToDefault();
	}
	
	function getAlbums(){
		$.getJSON('http://picasaweb.google.com/data/feed/api/user/mikesorvillo?alt=json', function(data) {
			albums = data.feed.entry;
			iterate(0);
			
			/*for(var i = 0; i < albums.length; i++){
				console.log(i + " - " + albums[i].gphoto$location.$t);
				$.getJSON("http://maps.google.com/maps/api/geocode/json?address=" + albums[i].gphoto$location.$t + "&sensor=false", function(data){
					alert("HELLO")
				});
				
				geocoder.getLatLng(albums[i].gphoto$location.$t, onAddressFound);
			} */ 	
		})			
	}
	
	//using setTimeout for recursion. god, this is so hacky.
	function iterate(count){
		geocoder.getLatLng(albums[count].gphoto$location.$t, onAddressFound);
		count++;
		
		if(count < albums.length){
			setTimeout(function(){iterate(count)}, 200);
		}
	}
	
	function onAddressFound(point){
		if (!point) {
	    } else {
	      	var marker = new GMarker(point);
	      	map.addOverlay(marker);
		  	GEvent.addListener(marker, "click", showPics);
	    }
	}
	
	function showPics(){
		//console.log("showing pictures for...")
	}
	
	function Album(id, loc){
		this.albumId = id;
		this.location = loc;
	}
	
})(jQuery);




