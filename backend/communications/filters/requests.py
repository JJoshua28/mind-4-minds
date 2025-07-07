import django_filters

from ..models import Requests

class RequestsFilter(django_filters.FilterSet):
    user_details_id = django_filters.CharFilter(field_name='recipients__id', lookup_expr='exact')
    is_new = django_filters.BooleanFilter(field_name='is_new', lookup_expr='exact')

    class Meta:
        model = Requests
        fields = [
            'recipients',
            "is_new"
        ]

