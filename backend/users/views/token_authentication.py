from rest_framework_simplejwt.views import TokenObtainPairView
from ..authentication_serializer import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
