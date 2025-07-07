from django.test import TestCase
from uuid import uuid4

from users.models import (
    UserDetails,
    MenteeDetails,
    MentorDetails,
    MenteeMentorLink,
)
from django.contrib.auth import get_user_model
from users.serializers.mentee_mentor_link import MenteeMentorLinkSerializer

User = get_user_model()


class MenteeMentorLinkSerializerTest(TestCase):
    def setUp(self):
        # Mentor side
        self.mentor_user = User.objects.create(email="mentor@example.com")
        self.mentor_user_details = UserDetails.objects.create(user=self.mentor_user)
        self.mentor = MentorDetails.objects.create(
            user_details=self.mentor_user_details,
            description="Testing mentor",
            qualifications="Some degree",
            experience="5 years",
            commitment="5 hours/week",
            is_available=True,
            meeting_preferences=["email"]
        )

        # Mentee side
        self.mentee_user = User.objects.create(email="mentee@example.com")
        self.mentee_user_details = UserDetails.objects.create(user=self.mentee_user)
        self.mentee = MenteeDetails.objects.create(
            id=uuid4(),
            user_details=self.mentee_user_details,
            goals=["Learn Python"],
            expectations="Weekly meetings",
        )

        # Link mentor and mentee
        self.link = MenteeMentorLink.objects.create(
            mentors=self.mentor,
            mentees=self.mentee
        )

    def test_serializer_output(self):
        serializer = MenteeMentorLinkSerializer(instance=self.link)
        data = serializer.data

        self.assertEqual(data["id"], self.link.id)
        self.assertEqual(str(data["mentors"]), str(self.mentor.id))
        self.assertEqual(str(data["mentees"]), str(self.mentee.id))

        mentor_record = data["mentor_record"]
        self.assertEqual(mentor_record["id"], str(self.mentor.id))
        self.assertEqual(mentor_record["description"], "Testing mentor")

        mentee_record = data["mentee_record"]
        self.assertEqual(mentee_record["id"], str(self.mentee.id))
        self.assertEqual(mentee_record["goals"], ["Learn Python"])
        self.assertEqual(mentee_record["expectations"], "Weekly meetings")



