from data.models import Location, Album, Photo
from django.contrib import admin

class AlbumInline(admin.StackedInline):
    model = Album
    extra = 0
    
    
class LocationAdmin(admin.ModelAdmin):
    inlines = [AlbumInline]
    list_display = ('name', 'lat', 'lng') 

class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 0


class AlbumAdmin(admin.ModelAdmin):
    inlines = [PhotoInline]
    list_display = ('name', 'location', 'date')    
        
admin.site.register(Location, LocationAdmin)
admin.site.register(Album, AlbumAdmin)