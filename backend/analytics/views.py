from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Avg
from .models import AnalyticsRecord, Annotation
from .serializers import AnalyticsRecordSerializer, AnnotationSerializer
from .custom_filters import AnalyticsFilter
from .paginators import CustomPagination




class AnalyticsRecordViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AnalyticsRecord.objects.all()
    serializer_class = AnalyticsRecordSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = AnalyticsFilter
    search_fields = ['keyword']
    ordering_fields = ['date', 'keyword', 'search_volume', 'clicks', 'ctr', 'rank']
    ordering = ['-date']


    @action(detail=False, methods=['get'])
    def summary(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        
        summary = queryset.aggregate(
            total_records=Sum('search_volume'),
            total_clicks=Sum('clicks'),
            average_ctr=Avg('ctr'),
            average_rank=Avg('rank')
        )
        
        return Response({
            'total_records': summary['total_records'] or 0,
            'total_clicks': summary['total_clicks'] or 0,
            'average_ctr': round(summary['average_ctr'] or 0, 2),
            'average_rank': round(summary['average_rank'] or 0, 1)
        })
        
    @action(detail=False, methods=['get'])
    def chart(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        
        chart_data = queryset.values('date').annotate(
            total_clicks=Sum('clicks'),
            average_ctr=Avg('ctr'),
            average_rank=Avg('rank'),
            search_volume=Sum('search_volume')
        ).order_by('date')
        
        return Response(list(chart_data))

class AnnotationViewSet(viewsets.ModelViewSet):
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer
    pagination_class = None
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date']
