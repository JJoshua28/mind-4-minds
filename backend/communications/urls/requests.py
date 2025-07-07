from rest_framework.routers import DefaultRouter
from ..views.requests import RequestsViewSet

router = DefaultRouter()
router.register(r'requests', RequestsViewSet, basename='communication-request')

urlpatterns = router.urls
