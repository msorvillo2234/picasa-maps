from django.http import HttpResponse
from models import Location, Album, Photo
from django.core import serializers
import datetime
import dbhelper
import httplib
import json

#xxx TODO - calling latlong/range is not giving uniques from DB. why?
def latlong(request, daterange=None):
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
    
    #if we have a range, scope to the range
    if daterange == None:
        return HttpResponse(serializers.serialize("json", Location.objects.all()))
    else:
        ary = daterange.split(":")
        lower = datetime.datetime.strptime(ary[0], "%m-%d-%Y")
        upper = datetime.datetime.strptime(ary[1], "%m-%d-%Y")
        return HttpResponse(serializers.serialize("json", Location.objects.filter(album__date__range=(lower, upper))))


#xxx TODO - refactor this method so it just returns a range for the slider
def getallalbums(request):
    """Returns JSON of all albums in album table"""
    return HttpResponse(serializers.serialize("json", Album.objects.all()))


def getalbum(request, location_id):
    """Given locationID, returns JSON of albums in that location from DB"""
    return HttpResponse(serializers.serialize("json", Album.objects.filter(location=location_id)))
 
 
def photos(request):
    return HttpResponse("Given album, returns photos in album")
    
    
    
#locs = ["name:%s, lat:%s long:%s" % (loc.name, loc.lat, loc.long) for loc in list]