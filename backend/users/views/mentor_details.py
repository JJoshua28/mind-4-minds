from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action

from ..models import MentorDetails
from ..serializers.mentor_details import MentorDetailsSerializer
from ..serializers.mentee_details import MenteeDetailsSerializer
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

    @action(detail=True, methods=["get"])
    def mentees(self, request, pk=None):
        mentor = self.get_object()
        mentees = mentor.menteedetails_set.all()
        serializer = MenteeDetailsSerializer(mentees, many=True)
        return Response(serializer.data)
