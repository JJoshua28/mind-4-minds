from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import UserDetails
from .users import CustomUserSerializer

User = get_user_model()

class UserDetailsSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, write_only=True)
    profilePic = serializers.SerializerMethodField(read_only=True)
    profile_pic = serializers.ImageField(required=False, write_only=True)
    occupation_start_date = serializers.DateField(required=False)
    occupation = serializers.CharField(required=False)
    user_account = CustomUserSerializer(read_only=True, source='user')

    class Meta:
        model = UserDetails
        fields = [
            'id',
            'user',
            'user_account',
            'first_name',
            'last_name',
            'roles',
            'occupation',
            'occupation_start_date',
            'profile_pic',
            'profilePic',
        ]
    def get(self):
        return UserDetails.objects.all().exclude(user=self.request.user)


    def get_profilePic(self, obj):
        request = self.context.get('request')
        if obj.profile_pic and request:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None
