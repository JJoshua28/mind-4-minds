from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..models import UserDetails
from ..serializers.user_details import UserDetailsSerializer

class UserDetailsViewSet(viewsets.ModelViewSet):
    queryset = UserDetails.objects.filter(user__is_active=True)
    serializer_class = UserDetailsSerializer

    def get_permissions(self):
        if self.action == 'create':  # 'create' maps to POST
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
