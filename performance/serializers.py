from rest_framework import serializers
from .models import PerformanceCriteria, PerformanceReview, PerformanceScore, Goal
from employees.serializers import EmployeeListSerializer

class PerformanceCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceCriteria
        fields = (
            'id', 'name', 'description', 'category', 'weight',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class PerformanceScoreSerializer(serializers.ModelSerializer):
    criteria_name = serializers.CharField(source='criteria.name', read_only=True)
    weighted_score = serializers.SerializerMethodField()

    class Meta:
        model = PerformanceScore
        fields = (
            'id', 'review', 'criteria', 'criteria_name', 'score',
            'weighted_score', 'comments', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'weighted_score', 'created_at', 'updated_at')

    def get_weighted_score(self, obj):
        return obj.calculate_weighted_score()

    def validate_score(self, value):
        if not (0 <= value <= 5):
            raise serializers.ValidationError('Score must be between 0 and 5')
        return value

class PerformanceReviewSerializer(serializers.ModelSerializer):
    employee_details = EmployeeListSerializer(source='employee', read_only=True)
    reviewer_details = EmployeeListSerializer(source='reviewer', read_only=True)
    scores = PerformanceScoreSerializer(many=True, read_only=True)
    overall_score = serializers.SerializerMethodField()

    class Meta:
        model = PerformanceReview
        fields = (
            'id', 'employee', 'employee_details', 'reviewer',
            'reviewer_details', 'review_type', 'review_period',
            'review_date', 'status', 'scores', 'overall_score',
            'strengths', 'areas_for_improvement', 'goals_assessment',
            'training_needs', 'employee_comments', 'reviewer_comments',
            'next_review_date', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'overall_score', 'created_at', 'updated_at'
        )

    def get_overall_score(self, obj):
        return obj.calculate_overall_score()

class GoalSerializer(serializers.ModelSerializer):
    employee_details = EmployeeListSerializer(source='employee', read_only=True)
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = (
            'id', 'employee', 'employee_details', 'title', 'description',
            'category', 'priority', 'start_date', 'due_date',
            'completion_date', 'status', 'progress_percentage',
            'measurement_criteria', 'resources_needed', 'challenges',
            'support_required', 'feedback', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_progress_percentage(self, obj):
        return obj.calculate_progress()

    def validate(self, data):
        if data.get('start_date') and data.get('due_date'):
            if data['start_date'] > data['due_date']:
                raise serializers.ValidationError({
                    'due_date': 'Due date must be after start date'
                })
        
        if data.get('completion_date'):
            if data.get('start_date') and data['completion_date'] < data['start_date']:
                raise serializers.ValidationError({
                    'completion_date': 'Completion date cannot be before start date'
                })
            if data.get('due_date') and data['completion_date'] > data['due_date']:
                raise serializers.ValidationError({
                    'completion_date': 'Completion date cannot be after due date'
                })
        
        return data

class EmployeePerformanceHistorySerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    employee_name = serializers.CharField()
    department = serializers.CharField()
    review_count = serializers.IntegerField()
    average_score = serializers.FloatField()
    completed_goals = serializers.IntegerField()
    ongoing_goals = serializers.IntegerField()
    latest_review_date = serializers.DateTimeField()
    next_review_date = serializers.DateTimeField()