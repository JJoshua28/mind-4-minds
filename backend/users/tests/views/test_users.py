from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class CustomUserViewSetTest(APITestCase):
    def setUp(self):
        # normal user
        self.user = User.objects.create_user(email="user@example.com", password="testpass123")
        # admin user
        self.admin = User.objects.create_user(email="admin@example.com", password="adminpass123", is_staff=True)
        # create a second user to later delete
        self.to_delete = User.objects.create_user(email="delete@example.com", password="deletepass123")

    def test_list_requires_authentication(self):
        url = reverse("custom-user-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # now authenticated
        self.client.force_authenticate(self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user_allowed(self):
        url = reverse("custom-user-list")
        data = {
            "email": "new@example.com",
            "password": "securepass123"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="new@example.com").exists())

    def test_delete_all_requires_admin(self):
        url = reverse("custom-user-delete-all")
        # not authenticated
        response = self.client.post(url, {"ids": [str(self.to_delete.id)]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # normal user
        self.client.force_authenticate(self.user)
        response = self.client.post(url, {"ids": [str(self.to_delete.id)]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # admin user
        self.client.force_authenticate(self.admin)
        response = self.client.post(url, {"ids": [str(self.to_delete.id)]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["deleted"], 1)
        self.assertFalse(User.objects.filter(id=self.to_delete.id).exists())

    def test_delete_all_with_invalid_ids(self):
        self.client.force_authenticate(self.admin)
        url = reverse("custom-user-delete-all")
        response = self.client.post(url, {"ids": "not-a-list"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)


