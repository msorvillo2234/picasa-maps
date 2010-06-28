from data.models import Location, Album, Photo
from django.contrib import admin

class AlbumInline(admin.TabularInline):
    model = Album
    extra = 0
    
    
class LocationAdmin(admin.ModelAdmin):
    inlines = [AlbumInline]
    list_display = ('name', 'latlng') 

class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 0


class AlbumAdmin(admin.ModelAdmin):
    inlines = [PhotoInline]
    list_display = ('name', 'location')    
        
admin.site.register(Location, LocationAdmin)
admin.site.register(Album, AlbumAdmin)