from django.db import transaction
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .mentee import CreateMenteeSerializer
from .mentor import CreateMentorSerializer
from users.models import MenteeDetails, MentorDetails
User = get_user_model()

class CreateAccountSerializer(serializers.Serializer):
    mentee_details =  CreateMenteeSerializer(required=False)
    mentor_details = CreateMentorSerializer(required=False)

    id = serializers.UUIDField(read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=True)
    details = serializers.PrimaryKeyRelatedField(read_only=True)
    joined = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(required=False, default=True)
    is_staff = serializers.BooleanField(required=False, default=False)

    roles = serializers.MultipleChoiceField(choices=['mentor', 'mentee', 'admin'], allow_empty=False, required=True)
    first_name = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True, min_length=2,
                                       max_length=50)
    last_name = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True, min_length=2,
                                      max_length=50)
    occupation = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100, min_length=2)
    occupation_start_date = serializers.DateTimeField(allow_null=True, required=False)
    profile_pic = serializers.ImageField(allow_null=True, required=False)

    def validate(self, data):
        if "mentor" in data.get("roles"):
            mentor_details = data.get("mentor_details")

            if not mentor_details:
                raise serializers.ValidationError({
                    "Mentor": "Mentor details required"
                })

        if "mentee" in data.get("roles"):
            mentee_details = data.get("mentee_details")

            if not mentee_details:
                raise serializers.ValidationError({
                    "Mentee": "Mentee details required"
                })
        return data

    @transaction.atomic
    def create(self, validated_data):
        mentee_details = validated_data.pop('mentee_details') if 'mentee_details' in validated_data else None
        mentor_details = validated_data.pop('mentor_details') if 'mentor_details' in validated_data else None

        user = User.objects.create_user(**validated_data)

        if mentee_details:
            MenteeDetails.objects.create(**mentee_details, user_details= user)

        if mentor_details:
            MentorDetails.objects.create(**mentor_details, user_details= user)

        return user






