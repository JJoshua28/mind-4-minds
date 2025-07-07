from django.test import TestCase
from users.models import (
    MenteeDetails,
    UserDetails,
    CustomUser,
    MentorDetails,
    MenteeMentorLink,
)
from users.serializers.mentee_details import MenteeDetailsSerializer


class MenteeDetailsSerializerTest(TestCase):
    def setUp(self):
        self.custom_user = CustomUser.objects.create_user(email="test@example.com", password="pass123")
        self.user_details = UserDetails.objects.create(
            user=self.custom_user,
            first_name="John",
            last_name="Doe",
            roles=["MENTEE"]
        )

    def test_serialization(self):
        mentee = MenteeDetails.objects.create(
            user_details=self.user_details,
            description="I want to learn Python",
            goals=["Learn basics", "Do projects"],
            learning_preferences=["Visual", "Hands-on"],
            meeting_preferences=["Online"],
            neurodivergent_conditions=["ADHD"],
            commitment="2 hours a week",
            expectations="Flexible scheduling"
        )

        serializer = MenteeDetailsSerializer(mentee)
        data = serializer.data

        self.assertEqual(data["description"], "I want to learn Python")
        self.assertEqual(str(data["user_details"]), str(self.user_details.id))
        self.assertEqual(data["user_details_record"]["user_account"]["email"], "test@example.com")
        self.assertEqual(data["goals"], ["Learn basics", "Do projects"])
        self.assertEqual(data["commitment"], "2 hours a week")
        self.assertEqual(data["expectations"], "Flexible scheduling")

    def test_deserialization_and_update_with_mentor_ids(self):
        mentee = MenteeDetails.objects.create(
            user_details=self.user_details,
            description="Initial desc",
            goals=["Goal1"],
            learning_preferences=["Visual"],
            meeting_preferences=["Online"],
            neurodivergent_conditions=[],
            commitment="1 hour a week",
            expectations="Flexible"
        )

        # Create separate CustomUsers and UserDetails for each mentor
        custom_user1 = CustomUser.objects.create_user(email="mentor1@example.com", password="pass123")
        user_details1 = UserDetails.objects.create(
            user=custom_user1,
            first_name="Mentor",
            last_name="One",
            roles=["MENTOR"]
        )
        mentor1 = MentorDetails.objects.create(
            user_details=user_details1,
            description="mentor1",
            qualifications="qual1",
            experience="exp1",
            commitment="2 hours",
            meeting_preferences=[],
            neurodivergent_conditions=[]
        )

        custom_user2 = CustomUser.objects.create_user(email="mentor2@example.com", password="pass123")
        user_details2 = UserDetails.objects.create(
            user=custom_user2,
            first_name="Mentor",
            last_name="Two",
            roles=["MENTOR"]
        )
        mentor2 = MentorDetails.objects.create(
            user_details=user_details2,
            description="mentor2",
            qualifications="qual2",
            experience="exp2",
            commitment="3 hours",
            meeting_preferences=[],
            neurodivergent_conditions=[]
        )

        data = {
            "description": "Updated desc",
            "goals": ["New goal"],
            "learning_preferences": ["Auditory"],
            "meeting_preferences": ["In-person"],
            "commitment": "3 hours a week",
            "mentor_ids": [str(mentor1.id), str(mentor2.id)],
        }

        serializer = MenteeDetailsSerializer(mentee, data=data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()

        self.assertEqual(updated.description, "Updated desc")
        self.assertEqual(updated.goals, ["New goal"])
        self.assertEqual(updated.commitment, "3 hours a week")

        links = MenteeMentorLink.objects.filter(mentees=mentee)
        self.assertEqual(links.count(), 2)
        self.assertSetEqual(
            set(links.values_list("mentors_id", flat=True)),
            {mentor1.id, mentor2.id}
        )

    def test_invalid_data(self):
        data = {
            "description": "",  # required but cannot be blank
            "goals": [],
            "learning_preferences": [],
            "meeting_preferences": [],
            "commitment": "",
        }
        serializer = MenteeDetailsSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("description", serializer.errors)
        self.assertIn("commitment", serializer.errors)
