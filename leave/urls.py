from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveTypeViewSet, LeaveBalanceViewSet, LeaveRequestViewSet

app_name = 'leave'

router = DefaultRouter()
router.register('types', LeaveTypeViewSet)
router.register('balances', LeaveBalanceViewSet)
router.register('requests', LeaveRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]