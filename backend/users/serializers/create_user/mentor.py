from rest_framework import serializers
from users.models import MentorDetails, CustomUser

class CreateMentorSerializer(serializers.ModelSerializer):

    user_details = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)


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
            'description',
            'qualifications',
            'experience',
            'is_available',
            'commitment',
            'meeting_preferences',
            'mentee_ids',
            'neurodivergent_conditions',
        ]