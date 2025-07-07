from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from ..serializers.users import CustomUserSerializer

from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

User = get_user_model()

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    @action(detail=False, methods=["POST"], url_path="delete-all", permission_classes=[IsAdminUser])
    def delete_all(self, request):
        ids = request.data.get('ids', [])
        if not isinstance(ids, list) or not ids:
            return Response({'error': 'Provide a list of account IDs to delete.'}, status=status.HTTP_400_BAD_REQUEST)
        objects = User.objects.filter(id__in=ids)
        count = objects.count()
        objects.delete()
        return Response({'deleted': count}, status=status.HTTP_200_OK)

