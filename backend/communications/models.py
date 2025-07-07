import uuid

from django.contrib.contenttypes.models import ContentType

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

from users.models import UserDetails


class Requests(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(
        UserDetails,
        related_name="sent_requests",
        on_delete=models.CASCADE
    )
    recipients = models.ManyToManyField(
        UserDetails,
        related_name="received_requests"
    )
    subject = models.CharField(max_length=255)
    action_type = models.CharField(max_length=255)
    is_complete = models.BooleanField(default=False)
    body = models.TextField()
    is_new = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)