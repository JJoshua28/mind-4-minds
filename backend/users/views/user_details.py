from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from ..filters.user_details import UserDetailsFilter
from ..models import UserDetails
from ..serializers.user_details import UserDetailsSerializer

class UserDetailsViewSet(viewsets.ModelViewSet):
    queryset = UserDetails.objects.all()
    serializer_class = UserDetailsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserDetailsFilter

    def get_permissions(self):
            if self.action == 'create':
                permission_classes = [AllowAny]
            else:
                permission_classes = [IsAuthenticated]
            return [permission() for permission in permission_classes]
