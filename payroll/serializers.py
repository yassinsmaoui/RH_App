from rest_framework import serializers
from .models import PayrollPeriod, PayrollRecord, Allowance, Deduction
from employees.serializers import EmployeeListSerializer

class AllowanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allowance
        fields = (
            'id', 'name', 'description', 'amount', 'is_taxable',
            'is_fixed', 'percentage', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, data):
        if data.get('is_fixed') and data.get('percentage'):
            raise serializers.ValidationError(
                'Cannot set both fixed amount and percentage'
            )
        if not data.get('is_fixed') and not data.get('percentage'):
            raise serializers.ValidationError(
                'Must set either fixed amount or percentage'
            )
        return data

class DeductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deduction
        fields = (
            'id', 'name', 'description', 'amount', 'is_fixed',
            'percentage', 'is_tax_deductible', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, data):
        if data.get('is_fixed') and data.get('percentage'):
            raise serializers.ValidationError(
                'Cannot set both fixed amount and percentage'
            )
        if not data.get('is_fixed') and not data.get('percentage'):
            raise serializers.ValidationError(
                'Must set either fixed amount or percentage'
            )
        return data

class PayrollPeriodSerializer(serializers.ModelSerializer):
    total_payroll = serializers.SerializerMethodField()
    processed_records = serializers.SerializerMethodField()

    class Meta:
        model = PayrollPeriod
        fields = (
            'id', 'period_type', 'start_date', 'end_date',
            'payment_date', 'status', 'total_payroll',
            'processed_records', 'notes', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'total_payroll', 'processed_records',
            'created_at', 'updated_at'
        )

    def get_total_payroll(self, obj):
        return obj.calculate_total_payroll()

    def get_processed_records(self, obj):
        return obj.payrollrecord_set.filter(status='processed').count()

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date'
            })
        if data['payment_date'] < data['end_date']:
            raise serializers.ValidationError({
                'payment_date': 'Payment date must be after period end date'
            })
        return data

class PayrollRecordSerializer(serializers.ModelSerializer):
    employee_details = EmployeeListSerializer(source='employee', read_only=True)
    period_details = PayrollPeriodSerializer(source='period', read_only=True)
    allowances = AllowanceSerializer(many=True, read_only=True)
    deductions = DeductionSerializer(many=True, read_only=True)

    class Meta:
        model = PayrollRecord
        fields = (
            'id', 'period', 'period_details', 'employee',
            'employee_details', 'basic_salary', 'overtime_hours',
            'overtime_rate', 'overtime_amount', 'allowances',
            'total_allowances', 'deductions', 'total_deductions',
            'gross_salary', 'net_salary', 'tax_amount', 'status',
            'notes', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'total_allowances', 'total_deductions',
            'gross_salary', 'net_salary', 'created_at', 'updated_at'
        )

class PayslipSerializer(serializers.ModelSerializer):
    employee_details = EmployeeListSerializer(source='employee', read_only=True)
    period_details = PayrollPeriodSerializer(source='period', read_only=True)
    allowance_details = serializers.SerializerMethodField()
    deduction_details = serializers.SerializerMethodField()

    class Meta:
        model = PayrollRecord
        fields = (
            'id', 'employee_details', 'period_details',
            'basic_salary', 'overtime_hours', 'overtime_rate',
            'overtime_amount', 'allowance_details', 'total_allowances',
            'deduction_details', 'total_deductions', 'gross_salary',
            'tax_amount', 'net_salary', 'payment_method', 'bank_account',
            'status', 'created_at'
        )

    def get_allowance_details(self, obj):
        return [{
            'name': allowance.name,
            'amount': allowance.calculate_amount(obj.basic_salary)
        } for allowance in obj.allowances.all()]

    def get_deduction_details(self, obj):
        return [{
            'name': deduction.name,
            'amount': deduction.calculate_amount(obj.gross_salary)
        } for deduction in obj.deductions.all()]