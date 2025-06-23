from rest_framework.routers import DefaultRouter
from ..views.users import CustomUserViewSet

router = DefaultRouter()
router.register(r'accounts', CustomUserViewSet, basename='custom-user')

urlpatterns = router.urls
