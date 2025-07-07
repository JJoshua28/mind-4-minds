import django_filters

from ..models import MenteeMentorLink

class MenteeMentorLinkFilter(django_filters.FilterSet):
    mentorId = django_filters.CharFilter(field_name='mentors__id', lookup_expr='exact')
    mentorByUserId = django_filters.CharFilter(field_name='mentors__user_details__id', lookup_expr='exact')
    menteeId = django_filters.CharFilter(field_name='mentees__id', lookup_expr='exact')
    menteeByUserId = django_filters.CharFilter(field_name='mentees__user_details__id', lookup_expr='exact')
    class Meta:
        model = MenteeMentorLink
        fields = [
            'mentorId',
            'menteeId',
            'mentorByUserId',
            'menteeByUserId'
        ]

