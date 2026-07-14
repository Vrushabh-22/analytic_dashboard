from django.db import models

class AnalyticsRecord(models.Model):
    date = models.DateField(db_index=True)
    keyword = models.CharField(max_length=255, db_index=True)
    category = models.CharField(max_length=100, db_index=True)
    status = models.CharField(max_length=50, db_index=True)
    device_type = models.CharField(max_length=50, db_index=True)
    source_type = models.CharField(max_length=100, db_index=True)
    search_volume = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    ctr = models.FloatField(default=0.0)
    rank = models.FloatField(default=0.0)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.keyword} - {self.date}"


class Annotation(models.Model):
    date = models.DateField(db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.title} on {self.date}"
