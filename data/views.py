from django.http import HttpResponse

def index(request):
    return HttpResponse("Show the homepage")
    
def latlong(request):
    return HttpResponse("Will return JSON of all locaations with latlongs")

def albums(request):
    return HttpResponse("Given location, returns multiple albums (if multiple) - if not, returns photos in album")
    
def photos(request):
    return HttpResponse("Given album, returns photos in album")