from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, AttendancePolicyViewSet

app_name = 'attendance'

router = DefaultRouter()
router.register('policies', AttendancePolicyViewSet)
router.register('', AttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]