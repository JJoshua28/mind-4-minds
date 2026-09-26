from django.db import transaction
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .mentee_details import MenteeDetailsSerializer
from .mentor_details import MentorDetailsSerializer
from ..models import MenteeDetails, MentorDetails
User = get_user_model()

class CreateUserSerializer(serializers.ModelSerializer):
    mentee_details =  MenteeDetailsSerializer(required=False)
    mentor_details = MentorDetailsSerializer(required=False)

    id = serializers.UUIDField(read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=True)
    details = serializers.PrimaryKeyRelatedField(read_only=True)
    joined = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(required=False, default=True)
    is_staff = serializers.BooleanField(required=False, default=False)

    roles = serializers.MultipleChoiceField(choices=['mentor', 'mentee', 'admin'], allow_blank=False, required=True)
    first_name = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True, min_length=2,
                                       max_length=50)
    last_name = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True, min_length=2,
                                      max_length=50)
    occupation = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100, min_length=2)
    occupation_start_date = serializers.DateTimeField(allow_null=True, required=False)
    profile_pic = serializers.ImageField(allow_null=True, required=False)

    @transaction.atomic
    def create(self, validated_data):
        mentee_details = validated_data.pop('mentee_details') if 'mentee_details' in validated_data else None
        mentor_details = validated_data.pop('mentor_details') if 'mentor_details' in validated_data else None

        if 'mentee' in validated_data['roles'] and not mentee_details:
            raise serializers.ValidationError({'mentee': 'Mentee details required'})

        if 'mentor' in validated_data['roles'] and not mentor_details:
            raise serializers.ValidationError({'mentor': 'Mentee details required'})

        user = User.objects.create_user(**validated_data)

        MenteeDetails.objects.create({**mentee_details, 'user_details': user.id})

        MentorDetails.objects.create({**mentor_details, 'user_details': user.id})

        return user






