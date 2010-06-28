//xxx TODO - update this API so it uses v3, not v2!
//xxx TODO - fix latlng once i update on backend

(function($) {
	var map, albums = [];
	
	$(document).ready(function(){
		initMap();
		createMarkers();
	});	
	
	function initMap()
	{
		map = new GMap2($("div#map") .get(0));
		map.setCenter(new GLatLng(30, -55), 3);
		map.setUIToDefault();
	}
	
	function createMarkers(point){
	    $.getJSON('http://localhost:8000/data/latlong/', function(data){
	        $(data).each(function(index){
	            loc = data[index];
	            latlng = (loc['fields']['latlng']).split(", ");
	            var marker = new GMarker(new GLatLng(latlng[0], latlng[1], false))
	            marker.table_id = loc['pk'];
	            marker.location_name = loc['fields']['name'];
	            map.addOverlay(marker);
	        });
	    });
	    GEvent.addListener(map, "click", showName);
	}
	
	function showName(obj){
	    if(obj){
	        $.getJSON('http://localhost:8000/data/albums/' + obj.table_id + "/", function(data){
    	        str = ""
    	        $(data).each(function(index){
                    str += data[index]['fields']['name'] + "<br/>";
    	        });
	            obj.openInfoWindow("<strong>" + obj.location_name + "</strong><br/><br/>" + str)
    	    });

	    }
	}
	
})(jQuery);




