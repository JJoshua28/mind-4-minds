from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status,viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from ..models import Requests
from ..serializers.requests import RequestsSerializer
from ..filters.requests import RequestsFilter
from users.models import UserDetails


class RequestsViewSet(viewsets.ModelViewSet):
    queryset = Requests.objects.all()
    serializer_class = RequestsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RequestsFilter

    @action(detail=False, methods=["POST"], url_path="delete-all")
    def delete_all(self, request):
        ids = request.data.get('ids', [])
        if not isinstance(ids, list) or not ids:
            return Response({'error': 'Provide a list of IDs to delete.'}, status=status.HTTP_400_BAD_REQUEST)
        objects = Requests.objects.filter(id__in=ids)

        count = objects.count()
        objects.delete()
        return Response({'deleted': count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["POST"], url_path="create-admin-request", permission_classes=[AllowAny])
    def create_admin_request(self, request):
        staff_users = UserDetails.objects.filter(user__is_staff=True, user__is_active=True)

        data = request.data.copy()
        data['recipients'] = []

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        request_obj = serializer.save()
        request_obj.recipients.set(staff_users)

        return Response(
            RequestsSerializer(request_obj).data,
            status=status.HTTP_201_CREATED
        )
