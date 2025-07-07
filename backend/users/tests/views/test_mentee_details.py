from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from users.models import MenteeDetails, MentorDetails, UserDetails

User = get_user_model()

class MenteeDetailsViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user@example.com", password="testpass123")
        self.user_details = UserDetails.objects.create(user=self.user, first_name="Test", last_name="User")
        self.mentee = MenteeDetails.objects.create(
            user_details=self.user_details,
            description="A mentee",
            goals=["Learn Python"],
            learning_preferences=[],
            expectations="Expectations",
            meeting_preferences=[],
            neurodivergent_conditions=[],
            commitment="Medium",
        )

        self.mentor_user = User.objects.create_user(email="mentor@example.com", password="mentorpass")
        self.mentor_user_details = UserDetails.objects.create(user=self.mentor_user, first_name="Mentor", last_name="User")
        self.mentor = MentorDetails.objects.create(
            user_details=self.mentor_user_details,
            description="A mentor",
            qualifications="PhD",
            experience="5 years",
            commitment="High",
            is_available=True,
            meeting_preferences=[],
            neurodivergent_conditions=[],
        )
        self.mentee.mentors.add(self.mentor)

    def test_mentors_action_requires_auth(self):
        url = reverse('mentee-details-mentors', kwargs={'pk': self.mentee.id})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['description'], "A mentor")
