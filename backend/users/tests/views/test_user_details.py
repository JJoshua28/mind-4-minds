from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from users.models import UserDetails
from rest_framework import status

User = get_user_model()

class UserDetailsViewSetTests(APITestCase):
    def setUp(self):
        other_user = User.objects.create_user(email="other@example.com", password="pass123")

        self.user = User.objects.create_user(email="test@example.com", password="pass123")
        self.user_details = UserDetails.objects.create(
            user=other_user,
            first_name="John",
            last_name="Doe",
            roles=["MENTEE"],
        )

        self.list_url = reverse("user-details-list")  # from router
        self.detail_url = reverse("user-details-detail", args=[self.user_details.id])

    def test_create_allowed_for_anonymous(self):
        payload = {
            "first_name": "Jane",
            "last_name": "Smith",
            "roles": ["MENTEE"],
            "user": str(self.user.id),  # linking to an existing user
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_requires_authentication(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_retrieve_requires_authentication(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(self.user_details.id))

    def test_update_requires_authentication(self):
        payload = {
            "first_name": "Updated",
            "last_name": "Doe",
            "roles": ["MENTEE"]
        }
        response = self.client.put(self.detail_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_authenticated(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "first_name": "Updated",
            "last_name": "Doe",
            "roles": ["MENTEE"]
        }
        response = self.client.put(self.detail_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Updated")

    def test_delete_requires_authentication(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
