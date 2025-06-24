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
        validated_data.pop('details', None)
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)  # 🔐 Ensure hashing

        instance.save()
        return instance
