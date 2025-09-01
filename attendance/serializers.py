from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Attendance, AttendancePolicy

User = get_user_model()

class AttendancePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendancePolicy
        fields = (
            'id', 'name', 'description', 'work_days', 'work_start_time',
            'work_end_time', 'break_start_time', 'break_end_time',
            'grace_period_minutes', 'overtime_threshold_minutes',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    policy_name = serializers.CharField(source='policy.name', read_only=True)
    total_work_hours = serializers.SerializerMethodField()
    overtime_hours = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = (
            'id', 'employee', 'employee_name', 'date', 'check_in',
            'check_out', 'attendance_type', 'work_hours', 'overtime_hours',
            'notes', 'is_approved', 'approved_by', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_employee_name(self, obj):
        return obj.employee.get_full_name() if obj.employee else None
    
    def get_total_work_hours(self, obj):
        return obj.work_hours or 0
    
    def get_overtime_hours(self, obj):
        return obj.overtime_hours or 0

class AttendanceReportSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    employee_name = serializers.CharField()
    department = serializers.CharField()
    total_days = serializers.IntegerField()
    present_days = serializers.IntegerField()
    absent_days = serializers.IntegerField()
    total_work_hours = serializers.FloatField()
    total_overtime_hours = serializers.FloatField()
    attendance_percentage = serializers.FloatField()

class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    total_work_hours = serializers.SerializerMethodField()
    overtime_hours = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = (
            'id', 'date', 'check_in', 'check_out', 'attendance_type',
            'work_hours', 'overtime_hours', 'notes'
        )

    def get_total_work_hours(self, obj):
        return obj.work_hours or 0

    def get_overtime_hours(self, obj):
        return obj.overtime_hours or 0