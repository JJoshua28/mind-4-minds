from rest_framework import serializers
from ..models import Requests
from users.serializers.users import CustomUserSerializer
from users.models import CustomUser

class RequestsSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)

    sender = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(is_active=True),
        required=False
    )
    recipients = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(is_active=True),
        many=True,
        required=False
    )
    body = serializers.CharField(required=True)
    action_type = serializers.CharField(required=True)
    subject = serializers.CharField(required=True)
    is_new = serializers.BooleanField(default=True)
    is_complete = serializers.BooleanField(default=False)
    created_at = serializers.DateTimeField(read_only=True)

    sender_record = CustomUserSerializer(source="sender", read_only=True)
    recipients_record = CustomUserSerializer(source="recipients", many=True, read_only=True)

    class Meta:
        model = Requests
        fields = [
            'id',
            'sender',
            'recipients',
            'sender_record',
            'recipients_record',
            'subject',
            "is_complete",
            'body',
            'is_new',
            'created_at',
            'action_type'
        ]
