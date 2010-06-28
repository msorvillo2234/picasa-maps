from django.db import models

#xxx TODO - break up latlng into two fields
class Location(models.Model):
    name = models.CharField(max_length=200)
    latlng = models.CharField(max_length=100)

    def __unicode__(self):
        return self.name 


class Album(models.Model):
    name = models.CharField(max_length=200)
    cover = models.URLField(max_length=500)
    publicurl = models.URLField(max_length=500)
    apiurl = models.URLField(max_length=500)
    location = models.ForeignKey(Location)

    def __unicode__(self):
        return self.name


class Photo(models.Model):
    url = models.URLField(max_length=200)
    album = models.ForeignKey(Album)

    def __unicode__(self):
        return self.url