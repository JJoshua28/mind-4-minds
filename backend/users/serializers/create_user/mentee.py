from rest_framework import serializers

from users.models import MenteeDetails, CustomUser

class CreateMenteeSerializer(serializers.ModelSerializer):
    user_details = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)
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
