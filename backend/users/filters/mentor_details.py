import django_filters

from ..models import MentorDetails

class MentorDetailsFilter(django_filters.FilterSet):
    user_id = django_filters.CharFilter(field_name='user_details__id', lookup_expr='exact')
    is_available = django_filters.BooleanFilter(field_name='is_available')
    user_id_not = django_filters.CharFilter(method='filter_user_id_not')

    class Meta:
        model = MentorDetails
        fields = [
            'user_details',
            'is_available'
        ]

    def filter_user_id_not(self, queryset, name, value):
        return queryset.exclude(user_details__id=value)

