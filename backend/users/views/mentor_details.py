from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from ..models import MentorDetails
from ..serializers.mentor_details import MentorDetailsSerializer
from ..filters.mentor_details import MentorDetailsFilter

class MentorDetailsViewSet(viewsets.ModelViewSet):
    queryset = MentorDetails.objects.filter(user_details__user__is_active=True)
    serializer_class = MentorDetailsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = MentorDetailsFilter

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
