window.onload = initMap;

var map;
var geocoder;

function initMap()
{
	map = new GMap2(document.getElementById("map"));
	map.setUIToDefault();

	geocoder = new GClientGeocoder();
  	geocoder.getLatLng("New York, NY", onAddressFound);

	//populateMarkers(100);
}

function populateMarkers(n) {
  for (var i = 0; i < n; ++i) {
	var marker = new GMarker(getRandomPoint());
	map.addOverlay(marker);
  	GEvent.addListener(marker, "click", showInfoWindow);
  }
}

function getRandomPoint() {
  var lat = 48.25 + (Math.random() - 0.5)*14.5;
  var lng = 11.00 + (Math.random() - 0.5)*36.0;
  return new GLatLng(Math.round(lat*10)/10, Math.round(lng*10)/10);
}

function onAddressFound(latlng){
	if (!latlng) {
		alert(address + " not found");
    } else {
      	map.setCenter(latlng, 15);
      	var marker = new GMarker(latlng);
      	map.addOverlay(marker);
	  	GEvent.addListener(marker, "click", showInfoWindow);
    }
}

function showInfoWindow(latlng){
	map.openInfoWindow(map.getCenter(), document.createTextNode("Hello, test!"));
}