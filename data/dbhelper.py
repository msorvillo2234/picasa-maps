from models import Location, Album, Photo
import httplib
import json
import datetime

def checkfordata():
    """Checks picasa for any new albums we don't have in the DB"""
    
    conn = httplib.HTTPConnection("picasaweb.google.com")
    conn.request("GET", "/data/feed/api/user/mikesorvillo?alt=json")
    response = json.loads(conn.getresponse().read())
    albums = response['feed']['entry']    
        
    if len(albums) != Album.objects.count():
        importAlbums(albums)
    
    conn.close() 


def importAlbums(album_list):
    """Takes a list of albums, and creates album and location entries in DB"""

    for album in album_list:
        point = str(album['georss$where']['gml$Point']['gml$pos']['$t'])
        pointStr = point.split(" ")
        loc_obj, created = Location.objects.get_or_create(name=album['gphoto$location']['$t'], defaults={'lat':pointStr[0], 'lng': pointStr[1]})
        Album.objects.get_or_create(name=album['title']['$t'],
                             cover=album['media$group']['media$thumbnail'][0]['url'],
                             url=album['link'][1]['href'],
                             feed=album['id']['$t'],
                             date = datetime.datetime.strptime(album['published']['$t'], "%Y-%m-%dT%H:%M:%S.000Z"),
                             location=loc_obj)
                
