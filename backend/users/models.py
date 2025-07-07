import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

from .helpers.random_profile_pic_name import profile_pic_upload_to


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field is required')

        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    class Meta:
        app_label = "users"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class UserType(models.TextChoices):
    MENTOR = 'MENTOR'
    MENTEE = 'MENTEE'
    ADMIN = 'ADMIN'

class UserDetails(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='details'
    )
    roles = models.JSONField(default=list)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    occupation = models.CharField(max_length=255, null=True, blank=True)
    occupation_start_date = models.DateField(null=True, blank=True)
    profile_pic = models.ImageField(upload_to=profile_pic_upload_to, null=True, blank=True)

class MenteeDetails(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_details = models.OneToOneField(UserDetails, on_delete=models.CASCADE, related_name='mentee_details')
    description = models.TextField()
    goals = models.JSONField(default=list)
    learning_preferences = models.JSONField(default=list)
    expectations = models.TextField()
    meeting_preferences = models.JSONField(default=list)
    neurodivergent_conditions = models.JSONField(default=list)
    commitment = models.CharField(max_length=255)
    mentors = models.ManyToManyField("MentorDetails", through='MenteeMentorLink')

class MentorDetails(models.Model):
        id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
        user_details = models.OneToOneField(UserDetails, on_delete=models.CASCADE, related_name='mentor_details')
        description = models.TextField()
        qualifications = models.TextField()
        experience = models.TextField(default="")
        commitment = models.CharField(max_length=255)
        is_available = models.BooleanField(default=True)
        meeting_preferences = models.JSONField(default=list)
        neurodivergent_conditions = models.JSONField(default=list)


class MenteeMentorLink(models.Model):
    mentors = models.ForeignKey(MentorDetails, on_delete=models.CASCADE)
    mentees = models.ForeignKey(MenteeDetails, on_delete=models.CASCADE)
