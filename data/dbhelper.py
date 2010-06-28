from models import Location, Album, Photo
import urllib
import json
import time

def importAlbums(album_list):
    """Takes a list of albums, and creates album and location entries in DB"""

    for album in album_list:
        point = (album['georss$where']['gml$Point']['gml$pos']['$t']).replace(" ", ", ")
        loc_obj, created = Location.objects.get_or_create(name=album['gphoto$location']['$t'], defaults={'latlng':point})
        Album.objects.get_or_create(name=album['title']['$t'],
                             cover=album['media$group']['media$thumbnail'][0]['url'],
                             publicurl=album['link'][1]['href'],
                             apiurl=album['id']['$t'],
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
                
