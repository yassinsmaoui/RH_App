from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, PositionViewSet

app_name = 'employees'

router = DefaultRouter()
router.register('departments', DepartmentViewSet)
router.register('positions', PositionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]