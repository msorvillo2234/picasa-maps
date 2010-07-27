from django.db import models

#xxx TODO - break up latlng into two fields
class Location(models.Model):
    name = models.CharField(max_length=200)
    lat = models.DecimalField(max_digits=11, decimal_places=8)
    lng = models.DecimalField(max_digits=11, decimal_places=8)

    def __unicode__(self):
        return self.name 


class Album(models.Model):
    name = models.CharField(max_length=200)
    cover = models.URLField(max_length=500)
    url = models.URLField(max_length=500)
    feed = models.URLField(max_length=500)
    date = models.DateTimeField()
    location = models.ForeignKey(Location)

    def __unicode__(self):
        return self.name


class Photo(models.Model):
    url = models.URLField(max_length=200)
    album = models.ForeignKey(Album)

    def __unicode__(self):
        return self.url