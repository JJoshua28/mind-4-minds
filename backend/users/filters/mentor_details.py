import django_filters

from ..models import MentorDetails

class MentorDetailsFilter(django_filters.FilterSet):
    user_id = django_filters.CharFilter(field_name='user_details__id', lookup_expr='exact')

    class Meta:
        model = MentorDetails
        fields = [
            'user_details',
        ]

