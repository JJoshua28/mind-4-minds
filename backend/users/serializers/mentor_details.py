from rest_framework import serializers
from ..models import MentorDetails
from .users import CustomUserSerializer

class MentorDetailsSerializer(serializers.ModelSerializer):
    user_details_record = CustomUserSerializer(
        read_only=True,
        source='user_details'
    )

    mentee_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )
    meeting_preferences = serializers.MultipleChoiceField(choices=['online messaging', 'face to face', 'video'], allow_empty=False)

    class Meta:
        model = MentorDetails
        fields = [
            'id',
            'user_details',
            'user_details_record',
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
