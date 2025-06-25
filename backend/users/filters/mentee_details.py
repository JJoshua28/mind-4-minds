import django_filters

from ..models import MenteeDetails

class MenteeDetailsFilter(django_filters.FilterSet):
    user_id = django_filters.CharFilter(field_name='user_details__id', lookup_expr='exact')

    class Meta:
        model = MenteeDetails
        fields = [
            'user_details',
        ]

