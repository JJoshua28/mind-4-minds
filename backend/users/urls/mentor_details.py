from rest_framework.routers import DefaultRouter
from ..views.mentor_details import MentorDetailsViewSet

router = DefaultRouter()
router.register(r'mentor-details', MentorDetailsViewSet, basename='mentor-details')

urlpatterns = router.urls
