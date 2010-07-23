//xxx TODO - get albums/id to only return albums in a given range
//xxx TODO - get jqueryui to call google code version?

(function($) {
	var map, openWindow, markers = [], sliderInit = false, sliderMin = -1, sliderMax = -1;
	
	$(document).ready(function(){    
		initMap();
	});	
	
	function initMap()
	{
		var myOptions = {
          zoom: 3,
          center: new google.maps.LatLng(30, -55),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map($("div#map").get(0), myOptions);  
        $.getJSON('http://localhost:8000/data/latlong/', createMarkers);
        
	}
		
	function createMarkers(data){
	    //close openwindows
        if(openWindow){
            openWindow.close();
        }
        
        //clear current markers
        for (i in markers) {
            markers[i].setMap(null);
        }

	    //set slider bounds
	    if(!sliderInit){
	        initSlider(parseDate(data[0]['mindate']), parseDate(data[0]['maxdate']));
        }
        
	    //iterate and create markers for all json location data
	    locs = data[0]['locations'];
	    $(locs).each(function(index){
            loc = locs[index];
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(loc['fields']['lat'], loc['fields']['lng']), 
                map: map, 
                title: loc['fields']['name'],
                table_id: loc['pk']
            });
            markers.push(marker);
            google.maps.event.addListener(marker, 'click', function(){showName(marker)});
        });
	}
	
	function updateMarkers(){
	    var lower = new Date($("#slider").slider("values", 0))
	    var upper = new Date($("#slider").slider("values", 1))
	    var lowerStr = (lower.getMonth()+1) + "-01-" + lower.getFullYear();
	    var lastUpperDate = (new Date((new Date(upper.getYear(), upper.getMonth()+1,1))-1)).getDate();
	    var upperStr = (upper.getMonth()+1) + "-" + lastUpperDate + "-" + upper.getFullYear();
	    $.getJSON('http://localhost:8000/data/latlong/' + lowerStr + ":" + upperStr + "/", createMarkers);
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
	
	function initSlider(minDate, maxDate){        
        $("#slider").slider({
			range: true,
			min: minDate,
			max: maxDate,
			values: [minDate, maxDate],
			slide: function(event, ui) {
				$("#header p").text(intToDate(ui.values[0]) + ' - ' + intToDate(ui.values[1]));
			},
			change: function(event, ui){
			    if(ui.values[0] != sliderMin || ui.values[1] != sliderMax){
			        updateMarkers();
		            sliderMin = ui.values[0];
		            sliderMax = ui.values[1];
		        }
			}
		});
		$("#header p").text(intToDate($("#slider").slider("values", 0)) + ' - ' + intToDate($("#slider").slider("values", 1)));
		sliderInit = true;
	}
	
	/***************************** DATE HELPERS *****************************/
	
	function parseDate(posixdate){
	    date = posixdate.split("T")[0].split("-")
	    time = posixdate.split("T")[1].split(":")
	    return Date.UTC(Number(date[0]), 
	                    Number(date[1]) - 1, 
	                    Number(date[2]), 
	                    Number(time[0]), 
	                    Number(time[1]), 
	                    Number(time[2]));
	}
	
	function intToDate(int){
	    var ary = new Date(int).toDateString().split(" ")
	    return ary[1] + " " + ary[3]
	}
	
})(jQuery);




