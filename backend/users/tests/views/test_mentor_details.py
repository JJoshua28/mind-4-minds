from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status

from users.models import MentorDetails, MenteeDetails, UserDetails

User = get_user_model()

class TestMentorDetailsViewSet(APITestCase):
    def setUp(self):
        # Create mentor user and details
        self.mentor_user = User.objects.create_user(email="mentor@example.com", password="mentorpass")
        self.mentor_user_details = UserDetails.objects.create(user=self.mentor_user, first_name="Mentor", last_name="User")
        self.mentor = MentorDetails.objects.create(
            user_details=self.mentor_user_details,
            description="Mentor Bio",
            qualifications="MSc",
            experience="2 years",
            commitment="High",
            is_available=True,
            meeting_preferences=[],
            neurodivergent_conditions=[],
        )

        self.mentee_user = User.objects.create_user(email="mentee@example.com", password="menteepass")
        self.mentee_user_details = UserDetails.objects.create(user=self.mentee_user, first_name="Mentee", last_name="User")
        self.mentee = MenteeDetails.objects.create(
            user_details=self.mentee_user_details,
            description="Mentee Bio",
            goals=["Learn Django"],
            learning_preferences=[],
            expectations="Be awesome",
            meeting_preferences=[],
            neurodivergent_conditions=[],
            commitment="Medium",
        )

        # Link mentor to mentee
        self.mentee.mentors.add(self.mentor)

    def test_mentees_action_requires_authentication(self):
        url = reverse("mentor-details-mentees", kwargs={"pk": self.mentor.pk})

        # Unauthenticated
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated
        self.client.force_authenticate(self.mentor_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should return one mentee
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["description"], "Mentee Bio")
