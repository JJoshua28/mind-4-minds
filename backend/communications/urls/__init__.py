from django.urls import path, include

urlpatterns = [
    path('communications/', include('communications.urls.requests')),
]
