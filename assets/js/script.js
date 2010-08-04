//xxx TODO - handle case for more than 1 album
//xxx TODO - loader
//xxx TODO - add thumbs or gallery toggler

(function($) {
	var map, markers = [], sliderInit = false, lowerStr = "", upperStr = "", sliderMin = -1, sliderMax = -1;
	
	$(document).ready(function(){    
	    $("#gallery").css("display", "none");
	    $("#gallery div#title a").click(function(event){
	       event.preventDefault();
           $("#gallery").css("display", "none");
	    });
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
        $.getJSON('http://localhost:8000/data/locations/', createMarkers); 
	}
		
	function updateMarkers(){
	    var lower = new Date($("#slider").slider("values", 0))
	    var upper = new Date($("#slider").slider("values", 1))
	    lowerStr = (lower.getMonth()+1) + "-01-" + lower.getFullYear();
	    var lastUpperDate = (new Date((new Date(upper.getYear(), upper.getMonth()+1,1))-1)).getDate();
	    upperStr = (upper.getMonth()+1) + "-" + lastUpperDate + "-" + upper.getFullYear();
	    $.getJSON('http://localhost:8000/data/locations/' + lowerStr + ":" + upperStr + "/", createMarkers);
	}
		
	function createMarkers(data){
	    //kill gallery
        $("#gallery").css("display", "none");
        
        //clear current markers
        for (i in markers) {
            markers[i].setMap(null);
        }

	    //set slider bounds
	    if(!sliderInit){
	        initSlider(parseDate(data['mindate']), parseDate(data['maxdate']));
        }
        
	    //iterate and create markers for all json location data
	    locs = data['locations'];
	    $(locs).each(function(index){
            loc = locs[index];
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(loc['fields']['lat'], loc['fields']['lng']), 
                map: map, 
                title: loc['fields']['name'],
                table_id: loc['pk']
            });
            markers.push(marker);
            google.maps.event.addListener(marker, 'click', function(){showAlbums(marker)});
        });
	}
	
	function showAlbums(marker){
	    if(marker && marker.table_id){
	        query = ""
	        if(lowerStr == "" && upperStr == ""){
	            query = 'http://localhost:8000/data/albums/' + marker.table_id + "/"
	        } else{
	            query = 'http://localhost:8000/data/albums/' + marker.table_id + "/" + lowerStr + ":" + upperStr + "/"
	        }
	        
	        $.getJSON(query, function(data){
	            if(data.length == 1){
	                $("#gallery").css("display", "block");
	                $("#gallery div#title img").attr("src", data[0]['fields']['cover']);
	                $("#gallery h2").html(data[0]['fields']['name']);
	                $("#gallery p").html(dateToString(data[0]['fields']['date']) + " - " + marker.title);
                    $.getJSON(data[0]['fields']['feed'], loadThumbs)
                } else{
                    console.log("more than one album")
                }
    	    });

	    }
	}
	
	function loadThumbs(data){
	    $("#gallery div#content").empty();
	    
	    //also append numphotos
	    $("#gallery em").html(data['feed']['gphoto$numphotos']['$t'] + " photos")
	    
	    var photos = data['feed']['entry']
	    $(photos).each(function(index){
	        var photo = photos[index];
	        var thumb = $('<a>').attr("href", photo['link'][1]['href']);
	        thumb.attr("target", "_blank");
	        thumb.css("background", "url(\"" + photo['media$group']['media$thumbnail'][1]['url'] + "\")" + "50% 50%");
	        $("#gallery div#content").append(thumb);
	    });
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
	    var date = posixdate.split("T")[0].split("-")
	    var time = posixdate.split("T")[1].split(":")
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
	
	function dateToString(from){
	    var ary = from.split(" ")[0].split("-")
	    var date = new Date(ary[0], ary[1], ary[2]).toDateString().split(" ")
	    return date[1] + " " + date[2] + ", " + date[3]
	}
	
})(jQuery);




