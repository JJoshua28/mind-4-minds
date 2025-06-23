from rest_framework import serializers
from ..models import MenteeDetails, UserDetails

class MenteeDetailsSerializer(serializers.ModelSerializer):
    user_details = serializers.PrimaryKeyRelatedField(queryset=UserDetails.objects.all())
    description = serializers.CharField()
    goals = serializers.ListField(child=serializers.CharField())
    learning_preferences = serializers.ListField(child=serializers.CharField())
    meeting_preferences = serializers.ListField(child=serializers.CharField())
    neurodivergent_conditions = serializers.ListField(child=serializers.CharField(), allow_empty=True, required=False)
    commitment = serializers.CharField()

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
        ]
