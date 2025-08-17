from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PerformanceCriteriaViewSet,
    GoalViewSet,
    PerformanceReviewViewSet,
    PerformanceScoreViewSet,
)

app_name = 'performance'

router = DefaultRouter()
router.register('criteria', PerformanceCriteriaViewSet)
router.register('goals', GoalViewSet)
router.register('reviews', PerformanceReviewViewSet)
router.register('scores', PerformanceScoreViewSet)

urlpatterns = [
    path('', include(router.urls)),
]