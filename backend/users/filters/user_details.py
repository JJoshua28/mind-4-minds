import django_filters

from ..models import UserDetails

class UserDetailsFilter(django_filters.FilterSet):
    user_account_id = django_filters.CharFilter(field_name='user__id', lookup_expr='exact')

    class Meta:
        model = UserDetails
        fields = [
            'user',
        ]

