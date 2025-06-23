from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        credentials = {
            'email': attrs.get("email"),
            'password': attrs.get("password")
        }

        user = authenticate(email=credentials['email'], password=credentials['password'])

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        data = super().validate(attrs)
        data['user_id'] = user.id
        return data
