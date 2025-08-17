from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PayrollPeriodViewSet,
    PayrollRecordViewSet,
    AllowanceViewSet,
    DeductionViewSet,
)

app_name = 'payroll'

router = DefaultRouter()
router.register('periods', PayrollPeriodViewSet)
router.register('records', PayrollRecordViewSet)
router.register('allowances', AllowanceViewSet)
router.register('deductions', DeductionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]