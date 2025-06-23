from rest_framework.routers import DefaultRouter
from ..views.user_details import UserDetailsViewSet  # adjust import path as needed

router = DefaultRouter()
router.register(r'details', UserDetailsViewSet, basename='user-details')

urlpatterns = router.urls
