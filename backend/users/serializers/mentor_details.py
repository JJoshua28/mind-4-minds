from rest_framework import serializers
from ..models import MentorDetails

class MentorDetailsSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    meeting_preferences = serializers.ListField(child=serializers.CharField())
    neurodivergent_conditions = serializers.ListField(child=serializers.CharField(), default=[], required=False)
    is_available = serializers.BooleanField(required=False)
    experience = serializers.CharField(required=False, allow_blank=True)
    user_details = serializers.PrimaryKeyRelatedField(queryset=MentorDetails.objects.all(), required=False)

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
