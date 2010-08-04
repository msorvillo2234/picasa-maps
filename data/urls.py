#xxx TODO - refactor so its location/locationID/album/albumID?startdate=foo?enddate=foo

from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('picasa-maps.data.views',
    (r'^locations/$', 'getlocations'),
    (r'^locations/(?P<daterange>.+)/$', 'getlocations'),
    (r'^albums/(?P<location_id>\d+)/$', 'getalbums'),
    (r'^albums/(?P<location_id>\d+)/(?P<daterange>.+)/$', 'getalbums'),
)
