from django.http import HttpResponse
from models import Location, Album, Photo
from django.core import serializers
from dbhelper import DBHelper
import httplib
import json

def index(request):
    return HttpResponse("Show the homepage")
    

def latlong(request):
    """Returns JSON of latlongs from the DB. If they don't exist in DB, we import the data from picasa"""
    
    #request picasa albums, encode into JSON
    conn = httplib.HTTPConnection("picasaweb.google.com")
    conn.request("GET", "/data/feed/api/user/mikesorvillo?alt=json")
    response = json.loads(conn.getresponse().read())
    albums = response['feed']['entry']    
    
    #if we have new albums, lets import them
    if len(albums) != Album.objects.count():
        DBHelper().importData(albums, startIndex=Album.objects.count())
    
    return HttpResponse(serializers.serialize("json", Location.objects.all()))
    


def albums(request):
    return HttpResponse("Given location, returns multiple albums (if multiple) - if not, returns photos in album")
    
def photos(request):
    return HttpResponse("Given album, returns photos in album")
    
    
    
#locs = ["name:%s, lat:%s long:%s" % (loc.name, loc.lat, loc.long) for loc in list]