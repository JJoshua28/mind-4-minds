from rest_framework.routers import DefaultRouter
from ..views.mentee_mentor_link import MenteeMentorLinkViewSet

router = DefaultRouter()
router.register(r'mentees-and-mentors', MenteeMentorLinkViewSet, basename='mentees-and-mentors')

urlpatterns = router.urls
