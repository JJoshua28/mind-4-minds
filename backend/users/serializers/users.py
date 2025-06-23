from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    details = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    is_active = serializers.BooleanField(required=False, default=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'details', 'is_active']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
