from rest_framework import serializers
from ..models import MentorDetails, UserDetails
from .user_details import UserDetailsSerializer
from .users import CustomUserSerializer

class MentorDetailsSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    meeting_preferences = serializers.ListField(child=serializers.CharField())
    neurodivergent_conditions = serializers.ListField(child=serializers.CharField(), default=[], required=False)
    is_available = serializers.BooleanField(required=False)
    experience = serializers.CharField(required=False, allow_blank=True)
    user_details = serializers.PrimaryKeyRelatedField(queryset=UserDetails.objects.all(), required=False)
    user_details_record = UserDetailsSerializer(
        read_only=True,
        source='user_details'
    )
    user_account = CustomUserSerializer(
        read_only=True,
        source='user_details.user'
    )


    class Meta:
        model = MentorDetails
        fields = [
            'id',
            'user_details',
            'user_details_record',
            'user_account',
            'description',
            'qualifications',
            'experience',
            'is_available',
            'commitment',
            'meeting_preferences',
            'neurodivergent_conditions',
        ]
