from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationTypeViewSet, NotificationViewSet, AlertViewSet

router = DefaultRouter()
router.register(r'types', NotificationTypeViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'alerts', AlertViewSet, basename='alert')

urlpatterns = [
    path('', include(router.urls)),
]
