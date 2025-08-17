from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q, Avg
from django.utils import timezone
from datetime import datetime
from .models import PerformanceCriteria, PerformanceReview, PerformanceScore, Goal
from .serializers import (
    PerformanceCriteriaSerializer,
    PerformanceReviewSerializer,
    PerformanceScoreSerializer,
    GoalSerializer
)

class PerformanceCriteriaViewSet(viewsets.ModelViewSet):
    queryset = PerformanceCriteria.objects.all()
    serializer_class = PerformanceCriteriaSerializer
    permission_classes = (permissions.IsAuthenticated,)

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Goal.objects.all()
        employee = self.request.query_params.get('employee', None)
        status = self.request.query_params.get('status', None)
        due_date = self.request.query_params.get('due_date', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if status:
            queryset = queryset.filter(status=status)
        if due_date:
            try:
                due_date = datetime.strptime(due_date, '%Y-%m-%d').date()
                queryset = queryset.filter(due_date=due_date)
            except ValueError:
                pass
        return queryset

class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = PerformanceReview.objects.all()
        employee = self.request.query_params.get('employee', None)
        reviewer = self.request.query_params.get('reviewer', None)
        status = self.request.query_params.get('status', None)
        review_date = self.request.query_params.get('review_date', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if reviewer:
            queryset = queryset.filter(reviewer_id=reviewer)
        if status:
            queryset = queryset.filter(status=status)
        if review_date:
            try:
                review_date = datetime.strptime(review_date, '%Y-%m-%d').date()
                queryset = queryset.filter(review_date=review_date)
            except ValueError:
                pass
        return queryset

    @action(detail=True, methods=['post'])
    def submit_review(self, request, pk=None):
        review = self.get_object()
        if review.status == 'draft':
            review.status = 'submitted'
            review.submission_date = timezone.now()
            review.save()
            return Response({'status': 'review submitted'}, status=status.HTTP_200_OK)
        return Response({'error': 'review cannot be submitted'}, status=status.HTTP_400_BAD_REQUEST)

class PerformanceScoreViewSet(viewsets.ModelViewSet):
    queryset = PerformanceScore.objects.all()
    serializer_class = PerformanceScoreSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = PerformanceScore.objects.all()
        review = self.request.query_params.get('review', None)
        criteria = self.request.query_params.get('criteria', None)

        if review:
            queryset = queryset.filter(review_id=review)
        if criteria:
            queryset = queryset.filter(criteria_id=criteria)
        return queryset

    @action(detail=False, methods=['get'])
    def average_scores(self, request):
        employee_id = request.query_params.get('employee', None)
        if not employee_id:
            return Response({'error': 'employee parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        avg_scores = self.get_queryset().filter(
            review__employee_id=employee_id
        ).values('criteria__name').annotate(average_score=Avg('score'))

        return Response(avg_scores)

class EmployeePerformanceHistoryView(generics.ListAPIView):
    serializer_class = PerformanceReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        queryset = PerformanceReview.objects.filter(employee_id=employee_id)

        if start_date and end_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    review_date__range=[start, end]
                )
            except ValueError:
                pass

        return queryset.order_by('-review_date')
