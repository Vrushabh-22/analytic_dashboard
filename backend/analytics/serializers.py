from rest_framework import serializers
from .models import AnalyticsRecord, Annotation

class AnalyticsRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsRecord
        fields = '__all__'

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = '__all__'

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("Description cannot be empty.")
        return value.strip()
