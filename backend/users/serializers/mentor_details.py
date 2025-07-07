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
    mentee_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
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
            'mentee_ids',
            'neurodivergent_conditions',
        ]

    def update(self, instance, validated_data):
        mentee_ids = validated_data.pop("mentee_ids", None)
        instance = super().update(instance, validated_data)

        if mentee_ids is not None:
            # first clear existing links:
            instance.menteedetails_set.clear()
            # then add new ones:
            from ..models import MenteeMentorLink
            for mentee_id in mentee_ids:
                MenteeMentorLink.objects.create(
                    mentors=instance,
                    mentees_id=mentee_id
                )
        return instance
