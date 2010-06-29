//xxx TODO - fix latlng once i update on backend

(function($) {
	var map, openWindow;
	
	$(document).ready(function(){
		initMap();
		createMarkers();
	});	
	
	function initMap()
	{
		var myOptions = {
          zoom: 3,
          center: new google.maps.LatLng(30, -55),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map($("div#map").get(0), myOptions);  
	}
	
	function createMarkers(point){
	    $.getJSON('http://localhost:8000/data/latlong/', function(data){
	        $(data).each(function(index){
	            loc = data[index];
	            latlng = (loc['fields']['latlng']).split(", ");
	            var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(latlng[0], latlng[1]), 
                    map: map, 
                    title: loc['fields']['name'],
                    table_id: loc['pk']
                });
                google.maps.event.addListener(marker, 'click', function(){showName(marker)});
	        });
	    });


	}
	
	function showName(marker){
	    if(marker && marker.table_id){
	        $.getJSON('http://localhost:8000/data/albums/' + marker.table_id + "/", function(data){
    	        albumStr = "";
    	        $(data).each(function(index){
                    albumStr += "<a target=\"_blank\" href=\"" + data[index]['fields']['publicurl'] + "\">" + data[index]['fields']['name'] + "</a><br/>";
    	        });
    	        
    	        if(openWindow){
    	            openWindow.close();
    	        }
    	        
    	        openWindow = new google.maps.InfoWindow({
                    content: "<strong>Albums in " + marker.title + "</a></strong><br/><br/>" + albumStr
                });
    	        openWindow.open(map, marker);
    	    });

	    }
	}
	
})(jQuery);




