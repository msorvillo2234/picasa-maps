from django.http import HttpResponse
import httplib
import json
import ast

def index(request):
    return HttpResponse("Show the homepage")
    
def latlong(request):
    conn = httplib.HTTPConnection("picasaweb.google.com")
    conn.request("GET", "/data/feed/api/user/mikesorvillo?alt=json")
    response = conn.getresponse().read()
    encoded = json.dumps(response)
    print type(encoded)
    return HttpResponse("Will return JSON of all locaations with latlongs")

def albums(request):
    return HttpResponse("Given location, returns multiple albums (if multiple) - if not, returns photos in album")
    
def photos(request):
    return HttpResponse("Given album, returns photos in album")