from rest_framework import serializers
from .models import Attendance, AttendancePolicy
from employees.serializers import EmployeeListSerializer

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
    employee_details = EmployeeListSerializer(source='employee', read_only=True)
    policy_name = serializers.CharField(source='policy.name', read_only=True)
    total_work_hours = serializers.SerializerMethodField()
    overtime_hours = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = (
            'id', 'employee', 'employee_details', 'date', 'check_in',
            'check_out', 'policy', 'policy_name', 'status', 'total_work_hours',
            'overtime_hours', 'late_arrival_minutes', 'early_departure_minutes',
            'break_minutes', 'notes', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'total_work_hours', 'overtime_hours',
            'late_arrival_minutes', 'early_departure_minutes',
            'created_at', 'updated_at'
        )

    def get_total_work_hours(self, obj):
        if obj.check_in and obj.check_out:
            total_minutes = obj.calculate_total_work_minutes()
            return round(total_minutes / 60, 2)
        return 0

    def get_overtime_hours(self, obj):
        if obj.check_in and obj.check_out and obj.policy:
            overtime_minutes = obj.calculate_overtime_minutes()
            return round(overtime_minutes / 60, 2)
        return 0

class AttendanceReportSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    employee_name = serializers.CharField()
    department = serializers.CharField()
    total_days = serializers.IntegerField()
    present_days = serializers.IntegerField()
    absent_days = serializers.IntegerField()
    late_arrivals = serializers.IntegerField()
    early_departures = serializers.IntegerField()
    total_work_hours = serializers.FloatField()
    total_overtime_hours = serializers.FloatField()
    attendance_percentage = serializers.FloatField()

class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    policy_name = serializers.CharField(source='policy.name', read_only=True)
    total_work_hours = serializers.SerializerMethodField()
    overtime_hours = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = (
            'id', 'date', 'check_in', 'check_out', 'policy_name',
            'status', 'total_work_hours', 'overtime_hours',
            'late_arrival_minutes', 'early_departure_minutes',
            'break_minutes', 'notes'
        )

    def get_total_work_hours(self, obj):
        if obj.check_in and obj.check_out:
            total_minutes = obj.calculate_total_work_minutes()
            return round(total_minutes / 60, 2)
        return 0

    def get_overtime_hours(self, obj):
        if obj.check_in and obj.check_out and obj.policy:
            overtime_minutes = obj.calculate_overtime_minutes()
            return round(overtime_minutes / 60, 2)
        return 0