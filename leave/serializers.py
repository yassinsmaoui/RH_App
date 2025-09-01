from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import LeaveType, LeaveBalance, LeaveRequest

User = get_user_model()

class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = (
            'id', 'name', 'description', 'default_days', 'is_paid',
            'requires_approval', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee_details = EmployeeListSerializer(source='employee', read_only=True)
    leave_type_name = serializers.CharField(source='leave_type.name', read_only=True)
    
    class Meta:
        model = LeaveBalance
        fields = (
            'id', 'employee', 'employee_details', 'leave_type',
            'leave_type_name', 'year', 'total_days', 'used_days',
            'remaining_days', 'carried_over_days', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'used_days', 'remaining_days',
            'created_at', 'updated_at'
        )

    def validate(self, data):
        if self.instance:
            # For updates, ensure total_days isn't less than used_days
            if data.get('total_days', self.instance.total_days) < self.instance.used_days:
                raise serializers.ValidationError({
                    'total_days': 'Total days cannot be less than already used days.'
                })
        return data

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_details = EmployeeListSerializer(source='employee', read_only=True)
    leave_type_name = serializers.CharField(source='leave_type.name', read_only=True)
    duration_days = serializers.SerializerMethodField()
    
    class Meta:
        model = LeaveRequest
        fields = (
            'id', 'employee', 'employee_details', 'leave_type',
            'leave_type_name', 'start_date', 'end_date', 'duration_days',
            'reason', 'status', 'approved_by', 'rejection_reason',
            'attachments', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'status', 'approved_by', 'rejection_reason',
            'created_at', 'updated_at'
        )

    def get_duration_days(self, obj):
        return obj.calculate_duration()

    def validate(self, data):
        # Validate date range
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date.'
            })

        # Check leave balance if creating new request
        if not self.instance:
            employee = data['employee']
            leave_type = data['leave_type']
            duration = (data['end_date'] - data['start_date']).days + 1

            try:
                balance = LeaveBalance.objects.get(
                    employee=employee,
                    leave_type=leave_type,
                    year=data['start_date'].year
                )
                if balance.remaining_days < duration:
                    raise serializers.ValidationError({
                        'duration': f'Insufficient leave balance. Available: {balance.remaining_days} days'
                    })
            except LeaveBalance.DoesNotExist:
                raise serializers.ValidationError({
                    'leave_type': 'No leave balance found for this type of leave'
                })

        return data

class LeaveRequestApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = ('id', 'status', 'rejection_reason')
        read_only_fields = ('id',)

    def validate_status(self, value):
        if value not in ['approved', 'rejected']:
            raise serializers.ValidationError(
                'Status must be either "approved" or "rejected".'
            )
        return value

    def validate(self, data):
        if data.get('status') == 'rejected' and not data.get('rejection_reason'):
            raise serializers.ValidationError({
                'rejection_reason': 'Rejection reason is required when rejecting a leave request.'
            })
        return data