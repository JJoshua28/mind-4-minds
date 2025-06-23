from django.urls import path, include

urlpatterns = [
    path('user-details', include('users.urls.users_details')),
    path('mentee-details', include('users.urls.mentee_details')),
    path('mentor-details', include('users.urls.mentor_details')),
    path('users', include('users.urls.users')),
]
