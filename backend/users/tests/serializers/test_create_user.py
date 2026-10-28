from django.test import TestCase
from datetime import date
from rest_framework.exceptions import ValidationError

from users.serializers.create_user.account import CreateAccountSerializer



class CreateAccountSerializerTests(TestCase):
    def test_should_reject_a_mentor_without_information(self):
        data = {
            "email": "mentor@example.com",
            "first_name": "Mentor",
            "last_name": "Example",
            "roles": ["mentor"],
            "occupation": "Developer",
            "occupation_start_date": str(date(2022, 1, 1)),
            "password": "securepassword123"
        }

        with self.assertRaisesMessage(ValidationError, "Mentor details required"):
            serializer = CreateAccountSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.assertIn("Mentor", serializer.errors, "Mentor details required")

    def test_should_reject_a_mentee_without_information(self):
        data = {
            "email": "mentee@example.com",
            "first_name": "Mentee",
            "last_name": "Example",
            "roles": ["mentee"],
            "occupation": "Developer",
            "occupation_start_date": str(date(2022, 1, 1)),
            "password": "securepassword123"
        }

        with self.assertRaisesMessage(ValidationError, "Mentee details required"):
            serializer = CreateAccountSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.assertIn("Mentee", serializer.errors, "Mentee details required")

    def test_should_reject_a_user_without_roles(self):
        data = {
            "email": "mentor@example.com",
            "first_name": "Mentor",
            "last_name": "Example",
            "occupation": "Developer",
            "occupation_start_date": str(date(2022, 1, 1)),
            "password": "securepassword123"
        }

        with self.assertRaises(ValidationError):
            serializer = CreateAccountSerializer(data=data)
            serializer.is_valid(raise_exception=True)
    def test_should_reject_a_user_with_no_roles(self):
        data = {
            "email": "mentor@example.com",
            "first_name": "Mentor",
            "last_name": "Example",
            "occupation": "Developer",
            "roles": [],
            "occupation_start_date": str(date(2022, 1, 1)),
            "password": "securepassword123"
        }

        with self.assertRaises(ValidationError):
            serializer = CreateAccountSerializer(data=data)
            serializer.is_valid(raise_exception=True)

    def test_should_create_a_valid_user_requesting_admin(self):
            data = {
                "email": "mentor@example.com",
                "first_name": "Mentor",
                "last_name": "Example",
                "occupation": "Developer",
                "roles": ["admin"],
                "occupation_start_date": str(date(2022, 1, 1)),
                "password": "securepassword123"
            }

            serializer = CreateAccountSerializer(data=data)
            self.assertTrue(serializer.is_valid())

    def test_should_create_a_valid_mentee(self):
            data = {
                "email": "Mente@example.com",
                "first_name": "Mentee",
                "last_name": "Example",
                "occupation": "Developer",
                "roles": ["mentee"],
                "occupation_start_date": str(date(2022, 1, 1)),
                "password": "securepassword123",
                "mentee_details": {
                "description": "Updated desc",
                "goals": ["New goal"],
                "learning_preferences": ["Auditory"],
                "expectations": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "meeting_preferences": ["face to face"],
                "neurodivergent_conditions": ["adhd"],
                "commitment": "3 hours a week",

                "mentor_ids": [],
                }
            }

            serializer = CreateAccountSerializer(data=data)
            self.assertTrue(serializer.is_valid())

    def test_should_create_a_valid_mentor(self):
        data = {
                "email": "mentor@example.com",
                "first_name": "Mentor",
                "last_name": "Example",
                "occupation": "Developer",
                "roles": ["mentor"],
                "occupation_start_date": str(date(2022, 1, 1)),
                "password": "securepassword123",
                "mentor_details":{
                    "description" : "Experienced mentor",
                    "commitment": "3 hours a week",
                    "qualifications" : "PhD in Testing",
                    "meeting_preferences" : ["online messaging", "video"]
                }
        }

        serializer = CreateAccountSerializer(data=data)
        self.assertTrue(serializer.is_valid())
