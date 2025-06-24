from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import UserDetails

User = get_user_model()

class UserDetailsSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, write_only=True)
    profilePic = serializers.SerializerMethodField(read_only=True)
    profile_pic = serializers.ImageField(required=False, write_only=True)
    occupation_start_date = serializers.DateField(required=False)
    occupation = serializers.CharField(required=False)

    class Meta:
        model = UserDetails
        fields = [
            'id',
            'user',
            'first_name',
            'last_name',
            'roles',
            'occupation',
            'occupation_start_date',
            'profile_pic',
            'profilePic',
        ]

    def get_profilePic(self, obj):
        request = self.context.get('request')
        if obj.profile_pic and request:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None
