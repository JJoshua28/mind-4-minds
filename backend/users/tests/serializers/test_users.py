from django.test import TestCase
from django.contrib.auth import get_user_model
from datetime import date
from users.serializers.users import CustomUserSerializer  # adjust path as needed

User = get_user_model()

class CustomUserSerializerTests(TestCase):

    def test_custom_user_serializer_create(self):
        data = {
            "email": "test@example.com",
            "first_name" : "John",
            "last_name" : "Doe",
            "roles" : ["mentee"],
            "occupation" : "Developer",
            "occupation_start_date" : str(date(2022, 1, 1)),
            "password": "securepassword123"
        }
        serializer = CustomUserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("securepassword123"))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)

    def test_custom_user_serializer_update(self):
        user = User.objects.create_user(
            email="original@example.com",
            password="originalpassword",
            first_name= "John",
            last_name= "Doe",
            roles= ["mentee"],
            occupation= "Developer",
        )

        update_data = {
            "email": "new@example.com",
            "password": "newpassword456",
            "roles": ["mentee"],
            "is_active": False
        }
        serializer = CustomUserSerializer(user, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_user = serializer.save()
        self.assertEqual(updated_user.email, "new@example.com")
        self.assertTrue(updated_user.check_password("newpassword456"))
        self.assertFalse(updated_user.is_active)

    def test_custom_user_serializer_invalid_email(self):
        data = {
            "email": "notanemail",
            "password": "abc"
        }
        serializer = CustomUserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_custom_user_serializer_requires_email(self):
        data = {
            "password": "abc"
        }
        serializer = CustomUserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
