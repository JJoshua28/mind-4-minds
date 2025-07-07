from django.test import TestCase
from uuid import uuid4
from users.models import MentorDetails, UserDetails, MenteeMentorLink, MenteeDetails
from users.serializers.mentor_details import MentorDetailsSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class MentorDetailsSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(email='test@example.com')
        self.user_details = UserDetails.objects.create(user=self.user)
        self.mentor = MentorDetails.objects.create(
            user_details=self.user_details,
            description="Experienced mentor",
            qualifications="PhD in Testing",
            is_available=True,
            meeting_preferences=["email", "video"]
        )

        # Create mentee UUIDs
        self.mentee_id_1 = uuid4()
        self.mentee_id_2 = uuid4()

        # create actual mentee records
        self.mentee1_user = User.objects.create(email="mentee1@example.com")
        self.mentee1_user_details = UserDetails.objects.create(user=self.mentee1_user)
        self.mentee1 = MenteeDetails.objects.create(
            id=self.mentee_id_1,
            user_details=self.mentee1_user_details
        )

        self.mentee2_user = User.objects.create(email="mentee2@example.com")
        self.mentee2_user_details = UserDetails.objects.create(user=self.mentee2_user)
        self.mentee2 = MenteeDetails.objects.create(
            id=self.mentee_id_2,
            user_details=self.mentee2_user_details
        )

        # Create the initial link to mentee1
        MenteeMentorLink.objects.create(mentors=self.mentor, mentees=self.mentee1)

    def test_update_with_mentee_ids_creates_links(self):
        # Prepare data with new mentee_ids
        update_data = {
            "description": "Updated mentor description",
            "mentee_ids": [str(self.mentee_id_1), str(self.mentee_id_2)],  # List of UUID strings
        }

        serializer = MentorDetailsSerializer(instance=self.mentor, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_mentor = serializer.save()

        # The description should be updated
        self.assertEqual(updated_mentor.description, "Updated mentor description")

        # Existing MenteeMentorLink should be cleared and recreated
        mentee_links = MenteeMentorLink.objects.filter(mentors=updated_mentor)
        self.assertEqual(mentee_links.count(), 2)

        mentee_ids_linked = set(link.mentees_id for link in mentee_links)
        self.assertIn(self.mentee_id_1, mentee_ids_linked)
        self.assertIn(self.mentee_id_2, mentee_ids_linked)

    def test_update_without_mentee_ids_does_not_change_links(self):
        # Get current count of mentee links
        initial_links_count = MenteeMentorLink.objects.filter(mentors=self.mentor).count()

        update_data = {
            "description": "Updated mentor description again"
            # no mentee_ids field provided
        }

        serializer = MentorDetailsSerializer(instance=self.mentor, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_mentor = serializer.save()

        self.assertEqual(updated_mentor.description, "Updated mentor description again")

        # MenteeMentorLink count should remain the same
        current_links_count = MenteeMentorLink.objects.filter(mentors=updated_mentor).count()
        self.assertEqual(initial_links_count, current_links_count)
