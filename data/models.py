from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=200)
    lat = models.DecimalField(max_digits=10, decimal_places=5)
    long = models.DecimalField(max_digits=10, decimal_places=5)

    def __unicode__(self):
        return self.name 


class Album(models.Model):
    name = models.CharField(max_length=200)
    url = models.URLField(max_length=500)
    location = models.ForeignKey(Location)

    def __unicode__(self):
        return self.name


class Photo(models.Model):
    url = models.URLField(max_length=200)
    album = models.ForeignKey(Album)

    def __unicode__(self):
        return self.url