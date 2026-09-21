from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=True)
    details = serializers.PrimaryKeyRelatedField(read_only=True)
    joined = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(required=False, default=True)
    is_staff = serializers.BooleanField(required=False, default=False)

    roles = serializers.MultipleChoiceField(choices=['MENTOR', 'MENTEE', 'ADMIN'], allow_blank=False, required=True, size=3)
    first_name = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True, min_length=2, max_length=50)
    last_name = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True, min_length=2, max_length=50)
    occupation = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100, min_length=2)
    occupation_start_date = serializers.DateTimeField(allow_blank=True, allow_null=True, required=False)
    profile_pic = serializers.ImageField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'password',
            'details',
            'is_active',
            'joined',
            'is_staff',
            'roles',
            'first_name',
            'last_name',
            'occupation',
            'occupation_start_date',
            'profile_pic'
        ]

    def create(self, validated_data):
        validated_data.pop('details', None)
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)  # 🔐 Ensure hashing

        instance.save()
        return instance
