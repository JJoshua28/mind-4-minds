from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from ..filters.mentee_mentor_link import MenteeMentorLinkFilter

from ..models import MenteeMentorLink
from ..serializers.mentee_mentor_link import MenteeMentorLinkSerializer


class MenteeMentorLinkViewSet(viewsets.ModelViewSet):
    queryset = MenteeMentorLink.objects.all()
    serializer_class = MenteeMentorLinkSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = MenteeMentorLinkFilter

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["POST"], url_path="delete-link")
    def delete_all(self, request):
        user_details = request.data.get('mentorUserDetailsId', "")
        mentee = request.data.get('menteeUserDetailsId', "")
        if not user_details or not mentee:
            return Response({'error': 'Provide a mentor and a mentee id.'}, status=status.HTTP_400_BAD_REQUEST)

        mentee_mentor_link = MenteeMentorLink.objects.filter(mentors__user_details__id=user_details, mentees__user_details__id=mentee)
        mentee_mentor_link.delete()
        return Response({'deleted': "ended the mentorship between the two users"}, status=status.HTTP_200_OK)



