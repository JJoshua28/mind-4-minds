from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls.users_details')),
    path('users/', include('users.urls.mentee_details')),
    path('users/', include('users.urls.mentor_details')),
    path('users/', include('users.urls.users')),
    path('users/', include('users.urls.mentee_mentor_link')),
]
