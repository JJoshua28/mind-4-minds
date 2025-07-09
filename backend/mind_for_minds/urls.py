"""
URL configuration for mind_for_minds project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.views.static import serve as static_serve
from django.conf.urls.static import static


from users.views.token_authentication import CustomTokenObtainPairView
from .views import FrontendAppView

print("hi")
print(settings.STATICFILES_DIRS[0])
print("bye")
urlpatterns = [
    path('api/token', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    path("api/", include("users.urls")),
    path("api/", include("communications.urls")),

    re_path(r'^static/(?P<path>.*)$', static_serve, {'document_root': settings.STATICFILES_DIRS[0]}),

    re_path(r'^(?!api/).*$', FrontendAppView.as_view()),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

