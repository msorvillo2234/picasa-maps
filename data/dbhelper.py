from models import Location, Album, Photo
import urllib
import json
import time
import datetime

def importAlbums(album_list):
    """Takes a list of albums, and creates album and location entries in DB"""

    for album in album_list:
        point = str(album['georss$where']['gml$Point']['gml$pos']['$t'])
        pointStr = point.split(" ")
        loc_obj, created = Location.objects.get_or_create(name=album['gphoto$location']['$t'], defaults={'lat':pointStr[0], 'lng': pointStr[1]})
        Album.objects.get_or_create(name=album['title']['$t'],
                             cover=album['media$group']['media$thumbnail'][0]['url'],
                             publicurl=album['link'][1]['href'],
                             apiurl=album['id']['$t'],
                             date = datetime.datetime.strptime(album['published']['$t'], "%Y-%m-%dT%H:%M:%S.000Z"),
                             location=loc_obj)           
                             
                             
        """locationList = [x['gphoto$location']['$t'] for x in albums]
        filteredList = list(set(locationList))
        print "Num Locations: %s -- Num Albums: %s" % (len(filteredList), len(albums))
        
        for location in filteredList:
            str = ("http://maps.google.com/maps/api/geocode/json?address=%s&sensor=false" % location).replace(" ", "+")
            geocode = urllib.urlopen(str).read()
            encoded = json.loads(geocode)
            print encoded['results'][0]['geometry']['location']
            time.sleep(0.3)"""
                
