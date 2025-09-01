from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.schemas import get_schema_view
from rest_framework import permissions
from . import views

urlpatterns = [
    # Page d'accueil
    path('', views.home_view, name='home'),
    path('api/status/', views.api_status, name='api_status'),
    
    path('admin/', admin.site.urls),
    path('api/schema/', get_schema_view(
        title='HR Management System API',
        description='API for HR Management System',
        version='1.0.0',
        permission_classes=[permissions.AllowAny],
    ), name='openapi-schema'),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/employees/', include('employees.urls')),
    # path('api/attendance/', include('attendance.urls')),
    # path('api/leave/', include('leave.urls')),
    # path('api/performance/', include('performance.urls')),
    # path('api/payroll/', include('payroll.urls')),
    # path('api/notifications/', include('notifications.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
