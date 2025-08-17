from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q, Sum
from django.utils import timezone
from datetime import datetime
from .models import PayrollPeriod, PayrollRecord, Allowance, Deduction
from .serializers import PayrollPeriodSerializer, PayrollRecordSerializer, AllowanceSerializer, DeductionSerializer

class PayrollPeriodViewSet(viewsets.ModelViewSet):
    queryset = PayrollPeriod.objects.all()
    serializer_class = PayrollPeriodSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = PayrollPeriod.objects.all()
        period_type = self.request.query_params.get('period_type', None)
        status = self.request.query_params.get('status', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if period_type:
            queryset = queryset.filter(period_type=period_type)
        if status:
            queryset = queryset.filter(status=status)
        if start_date and end_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(start_date__gte=start, end_date__lte=end)
            except ValueError:
                pass
        return queryset

    @action(detail=True, methods=['post'])
    def process_payroll(self, request, pk=None):
        period = self.get_object()
        if period.status == 'draft':
            period.status = 'processing'
            period.save()
            # Add your payroll processing logic here
            return Response({'status': 'payroll processing started'}, status=status.HTTP_200_OK)
        return Response({'error': 'payroll cannot be processed'}, status=status.HTTP_400_BAD_REQUEST)

class PayrollRecordViewSet(viewsets.ModelViewSet):
    queryset = PayrollRecord.objects.all()
    serializer_class = PayrollRecordSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = PayrollRecord.objects.all()
        employee = self.request.query_params.get('employee', None)
        period = self.request.query_params.get('period', None)
        status = self.request.query_params.get('status', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if period:
            queryset = queryset.filter(period_id=period)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=True, methods=['get'])
    def generate_payslip(self, request, pk=None):
        record = self.get_object()
        # Add your payslip generation logic here
        payslip_data = {
            'employee': record.employee.get_full_name(),
            'period': f"{record.period.start_date} - {record.period.end_date}",
            'basic_salary': record.basic_salary,
            'total_allowances': record.total_allowances,
            'total_deductions': record.total_deductions,
            'net_salary': record.net_salary
        }
        return Response(payslip_data)

class AllowanceViewSet(viewsets.ModelViewSet):
    queryset = Allowance.objects.all()
    serializer_class = AllowanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Allowance.objects.all()
        employee = self.request.query_params.get('employee', None)
        allowance_type = self.request.query_params.get('type', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if allowance_type:
            queryset = queryset.filter(allowance_type=allowance_type)
        return queryset

    @action(detail=False, methods=['get'])
    def total_by_employee(self, request):
        employee_id = request.query_params.get('employee', None)
        if not employee_id:
            return Response({'error': 'employee parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        total = self.get_queryset().filter(
            employee_id=employee_id
        ).aggregate(total_amount=Sum('amount'))

        return Response(total)

class DeductionViewSet(viewsets.ModelViewSet):
    queryset = Deduction.objects.all()
    serializer_class = DeductionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Deduction.objects.all()
        employee = self.request.query_params.get('employee', None)
        deduction_type = self.request.query_params.get('type', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if deduction_type:
            queryset = queryset.filter(deduction_type=deduction_type)
        return queryset

    @action(detail=False, methods=['get'])
    def total_by_employee(self, request):
        employee_id = request.query_params.get('employee', None)
        if not employee_id:
            return Response({'error': 'employee parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        total = self.get_queryset().filter(
            employee_id=employee_id
        ).aggregate(total_amount=Sum('amount'))

        return Response(total)

class EmployeePayrollHistoryView(generics.ListAPIView):
    serializer_class = PayrollRecordSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        queryset = PayrollRecord.objects.filter(employee_id=employee_id)

        if start_date and end_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    period__start_date__range=[start, end]
                )
            except ValueError:
                pass

        return queryset.order_by('-period__start_date')
