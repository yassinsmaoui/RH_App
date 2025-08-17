from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
)
from .api_views import login_view, user_profile, check_auth

app_name = 'accounts'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # API endpoints
    path('api/login/', login_view, name='api_login'),
    path('api/profile/', user_profile, name='api_profile'),
    path('api/check-auth/', check_auth, name='api_check_auth'),
]