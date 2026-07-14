import django_filters
from .models import AnalyticsRecord

class AnalyticsFilter(django_filters.FilterSet):
    keyword = django_filters.CharFilter(lookup_expr='icontains')
    rank_min = django_filters.NumberFilter(field_name='rank', lookup_expr='gte')
    rank_max = django_filters.NumberFilter(field_name='rank', lookup_expr='lte')
    
    class Meta:
        model = AnalyticsRecord
        fields = ['category', 'status', 'device_type', 'source_type', 'keyword']
