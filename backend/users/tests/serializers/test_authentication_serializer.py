from django.test import TestCase
from django.contrib.auth import get_user_model
from datetime import date
from rest_framework.exceptions import ValidationError

from users.serializers.authentication_serializer import CustomTokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpassword123",
            first_name="John",
            last_name="Doe",
            roles=["mentee"],
            occupation="Developer",
        )

    def test_valid_credentials_returns_tokens_and_user_id(self):
        data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "first_name": "John",
            "last_name": "Doe",
            "roles": ["mentee"],
            "occupation": "Developer",
            "occupation_start_date": str(date(2022, 1, 1)),
        }
        serializer = CustomTokenObtainPairSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        validated_data = serializer.validated_data

        self.assertIn("access", validated_data)
        self.assertIn("refresh", validated_data)
        self.assertEqual(str(validated_data["user_id"]), str(self.user.id))

    def test_invalid_password_raises_validation_error(self):
        data = {
            "email": "test@example.com",
            "password": "wrongpassword"
        }
        serializer = CustomTokenObtainPairSerializer(data=data)

        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_nonexistent_user_raises_validation_error(self):
        data = {
            "email": "nonexistent@example.com",
            "password": "somepassword"
        }
        serializer = CustomTokenObtainPairSerializer(data=data)

        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)
