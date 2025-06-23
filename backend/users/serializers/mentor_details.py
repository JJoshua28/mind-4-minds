from rest_framework import serializers
from ..models import MentorDetails

class MentorDetailsSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    meeting_preferences = serializers.ListField(child=serializers.CharField())
    neurodivergent_conditions = serializers.ListField(child=serializers.CharField())
    is_available = serializers.BooleanField(required=False)

    class Meta:
        model = MentorDetails
        fields = [
            'id',
            'user_details',
            'description',
            'qualifications',
            'experience',
            'is_available',
            'commitment',
            'meeting_preferences',
            'neurodivergent_conditions',
        ]
