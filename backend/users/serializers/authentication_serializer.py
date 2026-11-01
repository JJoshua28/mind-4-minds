from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        credentials = {
            'email': attrs.get("email"),
            'password': attrs.get("password")
        }

        user = authenticate(email=credentials['email'], password=credentials['password'])

        if not user:
            message = (
                "Incorrect password"
                if User.objects.filter(email=credentials['email']).exists()
                else "User does not exist with the provided username"
            )
            raise serializers.ValidationError(message)

        data = super().validate(attrs)
        data['user_id'] = user.id
        return data
