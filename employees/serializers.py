from rest_framework import serializers
from .models import Employee, Department
from django.contrib.auth import get_user_model

User = get_user_model()

class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ('id', 'name', 'code', 'description', 'manager',
                 'manager_name', 'employee_count', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_employee_count(self, obj):
        return obj.employee_set.count()

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}"
        return None

class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = (
            'id', 'employee_id', 'user', 'user_email', 'full_name',
            'department', 'department_name', 'position', 'employment_status',
            'employment_type', 'join_date', 'end_date', 'emergency_contact_name',
            'emergency_contact_phone', 'emergency_contact_relationship',
            'address', 'city', 'state', 'postal_code', 'country',
            'birth_date', 'gender', 'marital_status', 'nationality',
            'tax_id', 'bank_name', 'bank_account', 'basic_salary',
            'documents', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'employee_id', 'created_at', 'updated_at')

    def get_department_name(self, obj):
        return obj.department.name if obj.department else None

    def get_full_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return None

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

class EmployeeListSerializer(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = (
            'id', 'employee_id', 'full_name', 'department_name',
            'position', 'employment_status', 'join_date'
        )

    def get_department_name(self, obj):
        return obj.department.name if obj.department else None

    def get_full_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return None

class EmployeeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'documents')
        read_only_fields = ('id',)