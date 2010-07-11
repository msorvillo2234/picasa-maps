from django.http import HttpResponse
from models import Location, Album, Photo
from django.core import serializers
import dbhelper
import httplib
import json


def latlong(request, date=None):
    """Returns JSON of latlongs from the DB. If they don't exist in DB, we import the data from picasa"""
    
    #request picasa albums, encode into JSON
    conn = httplib.HTTPConnection("picasaweb.google.com")
    conn.request("GET", "/data/feed/api/user/mikesorvillo?alt=json")
    response = json.loads(conn.getresponse().read())
    albums = response['feed']['entry']    
        
    #import any new albums we have
    if len(albums) != Album.objects.count():
        dbhelper.importAlbums(albums)
    
    conn.close()
    
    if date == None:
        return HttpResponse(serializers.serialize("json", Location.objects.all()))
    else:
        return HttpResponse(serializers.serialize("json", Album.objects.all()))


def albums(request, location_id):
    """Given locationID, returns JSON of albums in that location from DB"""
    return HttpResponse(serializers.serialize("json", Album.objects.filter(location=location_id)))
    
def photos(request):
    return HttpResponse("Given album, returns photos in album")
    
    
    
#locs = ["name:%s, lat:%s long:%s" % (loc.name, loc.lat, loc.long) for loc in list]