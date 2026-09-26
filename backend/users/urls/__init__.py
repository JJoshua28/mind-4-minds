from django.urls import path, include
from users.views.create_user import create_user

urlpatterns = [
    path('users/', include('users.urls.users_details')),
    path('users/', include('users.urls.mentee_details')),
    path('users/', include('users.urls.mentor_details')),
    path('users/', include('users.urls.users')),
    path('users/', include('users.urls.mentee_mentor_link')),
    path("users/create/", create_user)
]
