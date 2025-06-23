from rest_framework.routers import DefaultRouter
from ..views.mentee_details import MenteeDetailsViewSet

router = DefaultRouter()
router.register(r'', MenteeDetailsViewSet, basename='mentee-details')

urlpatterns = router.urls
