from rest_framework import serializers

from ..models import MenteeMentorLink
from .mentor_details import MentorDetailsSerializer
from .mentee_details import MenteeDetailsSerializer

class MenteeMentorLinkSerializer(serializers.ModelSerializer):
    mentor_record = MentorDetailsSerializer(
        read_only=True,
        source='mentors'
    )
    mentee_record = MenteeDetailsSerializer(
        read_only=True,
        source='mentees'
    )

    class Meta:
        model = MenteeMentorLink
        fields = [
            'id',
            'mentors',
            'mentees',
            'mentor_record',
            'mentee_record',
        ]