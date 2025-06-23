from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..models import MenteeDetails
from ..serializers.mentee_details import MenteeDetailsSerializer

class MenteeDetailsViewSet(viewsets.ModelViewSet):
    queryset = MenteeDetails.objects.filter(user_details__user__is_active=True)
    serializer_class = MenteeDetailsSerializer

    def get_permissions(self):
        if self.action == 'create':  # 'create' maps to POST
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
