from django.http import HttpResponse
from models import Location, Album, Photo
from django.core import serializers
from django.db.models import Max, Min
from decimal import Decimal
import datetime
import dbhelper
import json

class MyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return "%s" % obj
        return json.JSONEncoder.default(self,obj)


def latlong(request, daterange=None):
    """Returns JSON of latlongs from the DB. If they don't exist in DB, we import the data from picasa"""
    
    dbhelper.checkfordata()
    locs = None

    #if we have a range, scope to it
    if daterange == None:
        locs = serializers.serialize("python", Location.objects.all())
    else:
        ary = daterange.split(":")
        lower = datetime.datetime.strptime(ary[0], "%m-%d-%Y")
        upper = datetime.datetime.strptime(ary[1], "%m-%d-%Y")
        locs = serializers.serialize("python", set(Location.objects.filter(album__date__range=(lower, upper))))

    #create the feed and dump the json
    mindate = Album.objects.aggregate(Min('date'))
    maxdate = Album.objects.aggregate(Max('date'))        
    strmin = (mindate['date__min']).isoformat()
    strmax = (maxdate['date__max']).isoformat()    
    feed = [{'mindate':strmin, 'maxdate':strmax, 'locations':locs}]
    return HttpResponse(json.dumps(feed, cls=MyJSONEncoder))


def getallalbums(request):
    """Returns JSON of all albums from DB"""
    return HttpResponse(serializers.serialize("json", Album.objects.all()))


def getalbums(request, location_id):
    """Given locationID, returns JSON of albums in that location from DB"""
    return HttpResponse(serializers.serialize("json", Album.objects.filter(location=location_id)))
 
 
def photos(request):
    return HttpResponse("Given album, returns photos in album")
    
    
    
#locs = ["name:%s, lat:%s long:%s" % (loc.name, loc.lat, loc.long) for loc in list]