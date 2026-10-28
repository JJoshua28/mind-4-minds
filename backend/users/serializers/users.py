from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    roles = serializers.MultipleChoiceField(choices=['mentor', 'mentee', 'admin'], allow_empty=False, required=True)


    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'password',
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
