from rest_framework import serializers

from ..models import MenteeDetails, UserDetails
from .user_details import UserDetailsSerializer

class MenteeDetailsSerializer(serializers.ModelSerializer):
    user_details = serializers.PrimaryKeyRelatedField(queryset=UserDetails.objects.all(), required=False)
    description = serializers.CharField()
    goals = serializers.ListField(child=serializers.CharField())
    learning_preferences = serializers.ListField(child=serializers.CharField())
    meeting_preferences = serializers.ListField(child=serializers.CharField())
    neurodivergent_conditions = serializers.ListField(child=serializers.CharField(), allow_empty=True, required=False)
    commitment = serializers.CharField()
    user_details_record = UserDetailsSerializer(
        read_only=True,
        source='user_details'
    )
    expectations = serializers.CharField(required=False, allow_blank=True)
    mentor_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = MenteeDetails
        fields = [
            'id',
            'user_details',
            'description',
            'user_details_record',
            'goals',
            'learning_preferences',
            'expectations',
            'meeting_preferences',
            'neurodivergent_conditions',
            'commitment',
            'mentor_ids',
        ]

    def update(self, instance, validated_data):
        mentor_ids = validated_data.pop("mentor_ids", None)
        instance = super().update(instance, validated_data)

        if mentor_ids is not None:
            # clear current links
            instance.mentors.clear()
            # add new
            from ..models import MenteeMentorLink
            for mentor_id in mentor_ids:
                MenteeMentorLink.objects.create(
                    mentors_id=mentor_id,
                    mentees=instance
                )
        return instance
