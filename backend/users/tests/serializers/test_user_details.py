from django.test import TestCase
from rest_framework.test import APIRequestFactory
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import date
from io import BytesIO
from PIL import Image

from users.models import CustomUser, UserDetails
from users.serializers.user_details import UserDetailsSerializer

def generate_test_image_file():
    img_io = BytesIO()
    image = Image.new("RGBA", (1, 1), (255, 0, 0, 0))  # 1x1 transparent pixel
    image.save(img_io, format="PNG")
    img_io.seek(0)
    return SimpleUploadedFile("avatar.png", img_io.read(), content_type="image/png")


class UserDetailsSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = CustomUser.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )

    def test_serialization_of_user_details(self):
        profile_pic = generate_test_image_file()
        details = UserDetails.objects.create(
            user=self.user,
            first_name="John",
            last_name="Doe",
            roles=["MENTEE"],
            occupation="Developer",
            occupation_start_date=date(2022, 1, 1),
            profile_pic=profile_pic
        )
        request = self.factory.get("/")
        serializer = UserDetailsSerializer(instance=details, context={"request": request})
        data = serializer.data

        self.assertEqual(data["first_name"], "John")
        self.assertEqual(data["last_name"], "Doe")
        self.assertEqual(data["roles"], ["MENTEE"])
        self.assertEqual(data["occupation"], "Developer")
        self.assertEqual(data["occupation_start_date"], "2022-01-01")
        self.assertEqual(data["user_account"]["email"], "test@example.com")

        self.assertIn("profilePic", data)
        self.assertIn("/profile_pics/", data["profilePic"])
        self.assertTrue(data["profilePic"].endswith(".png"))

    def test_deserialization_of_user_details(self):
        image_file = generate_test_image_file()
        payload = {
            "user": str(self.user.id),
            "first_name": "Alice",
            "last_name": "Smith",
            "roles": ["MENTOR"],
            "occupation": "Scientist",
            "occupation_start_date": "2023-01-01",
            "profile_pic": image_file,
        }
        serializer = UserDetailsSerializer(data=payload)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        user_details = serializer.save()
        self.assertEqual(user_details.user, self.user)
        self.assertEqual(user_details.first_name, "Alice")
        self.assertEqual(user_details.last_name, "Smith")
        self.assertEqual(user_details.roles, ["MENTOR"])
        self.assertEqual(user_details.occupation, "Scientist")
        self.assertEqual(user_details.occupation_start_date.isoformat(), "2023-01-01")
