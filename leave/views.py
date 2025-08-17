from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from django.utils import timezone
from datetime import datetime
from .models import LeaveType, LeaveBalance, LeaveRequest
from .serializers import LeaveTypeSerializer, LeaveBalanceSerializer, LeaveRequestSerializer, LeaveRequestApprovalSerializer

class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    permission_classes = (permissions.IsAuthenticated,)

class LeaveBalanceViewSet(viewsets.ModelViewSet):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = LeaveBalance.objects.all()
        employee = self.request.query_params.get('employee', None)
        leave_type = self.request.query_params.get('leave_type', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if leave_type:
            queryset = queryset.filter(leave_type_id=leave_type)

        return queryset

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = LeaveRequest.objects.all()
        employee = self.request.query_params.get('employee', None)
        status = self.request.query_params.get('status', None)
        leave_type = self.request.query_params.get('leave_type', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if status:
            queryset = queryset.filter(status=status)
        if leave_type:
            queryset = queryset.filter(leave_type_id=leave_type)

        return queryset

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave_request = self.get_object()
        serializer = LeaveRequestApprovalSerializer(data=request.data)
        
        if serializer.is_valid():
            leave_request.status = serializer.validated_data['status']
            leave_request.approved_by = request.user
            leave_request.approved_at = timezone.now()
            leave_request.save()
            
            return Response(LeaveRequestSerializer(leave_request).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_serializer_class(self):
        if self.action == 'approve_request':
            return LeaveRequestApprovalSerializer
        return LeaveRequestSerializer

    def get_queryset(self):
        queryset = LeaveRequest.objects.all()
        employee = self.request.query_params.get('employee', None)
        status = self.request.query_params.get('status', None)
        leave_type = self.request.query_params.get('leave_type', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if status:
            queryset = queryset.filter(status=status)
        if leave_type:
            queryset = queryset.filter(leave_type_id=leave_type)
        if start_date and end_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    Q(start_date__range=[start, end]) |
                    Q(end_date__range=[start, end])
                )
            except ValueError:
                pass

        return queryset

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user.employee)

    @action(detail=True, methods=['post'])
    def approve_request(self, request, pk=None):
        leave_request = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            status = serializer.validated_data['status']
            rejection_reason = serializer.validated_data.get('rejection_reason')

            if status == 'rejected' and not rejection_reason:
                return Response(
                    {"detail": "Rejection reason is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            leave_request.status = status
            leave_request.rejection_reason = rejection_reason
            leave_request.approved_by = request.user
            leave_request.approved_at = timezone.now()
            leave_request.save()

            # Update leave balance if request is approved
            if status == 'approved':
                leave_balance = LeaveBalance.objects.get(
                    employee=leave_request.employee,
                    leave_type=leave_request.leave_type
                )
                leave_balance.used_days += leave_request.duration_days
                leave_balance.save()

            return Response(self.get_serializer(leave_request).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeLeaveBalanceView(generics.ListAPIView):
    serializer_class = LeaveBalanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        return LeaveBalance.objects.filter(employee_id=employee_id)
