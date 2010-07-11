//xxx TODO - fix latlng once i update on backend

(function($) {
	var map, openWindow, minDate = "", maxDate = "";
	
	$(document).ready(function(){    
		//initMap();
		//createMarkers();
	    initSlider();
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
	            var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(loc['fields']['lat'], loc['fields']['lng']), 
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
	
	function initSlider(){
	    $.getJSON('http://localhost:8000/data/latlong/12', function(data){
	        $(data).each(function(index){
	            curDate = parseDate(data[index]['fields']['date']);
                if(minDate == "" && maxDate == ""){ 
                    minDate = curDate;
                    maxDate = curDate;
                }
                else if(curDate < minDate){ 
                    minDate = curDate;
                }
                else if(curDate > maxDate){ 
                    maxDate = curDate;
                }
	        });
	    });
    
        $("#slider").slider({
			range: true,
			min: 0,
			max: 500,
			values: [0, 500],
			slide: function(event, ui) {
				$("#header p").text(ui.values[0] + ' - ' + ui.values[1]);
			}
		});
		$("#header p").text($("#slider").slider("values", 0) + ' - ' + $("#slider").slider("values", 1));
		
    
	}
	
	/***************************** DATE HELPERS *****************************/
	
	function parseDate(posixdate){
	    date = posixdate.split(" ")[0].split("-")
	    time = posixdate.split(" ")[1].split(":")
	    return new Date(Number(date[0]), 
	                    Number(date[1]) - 1, 
	                    Number(date[2]), 
	                    Number(time[0]), 
	                    Number(time[1]), 
	                    Number(time[2]));
	}
	
	function getStep(){
	    minMonths = minDate.getMonth() + (minDate.getFullYear()*12)
        maxMonths = maxDate.getMonth() + (maxDate.getFullYear()*12) 
        return maxMonths - minMonths
	}
	
	function dateToInt(date){
	    retur
	}
	
	function intToDate(int){
	    
	}
	
})(jQuery);




