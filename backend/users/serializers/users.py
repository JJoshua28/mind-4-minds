from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=True)
    details = serializers.PrimaryKeyRelatedField(read_only=True)
    joined = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(required=False, default=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'details', 'is_active', 'joined']

    def create(self, validated_data):
        validated_data.pop('details', None)  # ensure no unexpected kwarg
        return User.objects.create_user(**validated_data)
