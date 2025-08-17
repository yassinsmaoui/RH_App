from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
from .models import Attendance, AttendancePolicy
from .serializers import AttendanceSerializer, AttendancePolicySerializer, AttendanceReportSerializer, EmployeeAttendanceSerializer

class AttendancePolicyViewSet(viewsets.ModelViewSet):
    queryset = AttendancePolicy.objects.all()
    serializer_class = AttendancePolicySerializer
    permission_classes = (permissions.IsAuthenticated,)

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Attendance.objects.all()
        employee = self.request.query_params.get('employee', None)
        date = self.request.query_params.get('date', None)
        status = self.request.query_params.get('status', None)

        if employee:
            queryset = queryset.filter(employee_id=employee)
        if date:
            try:
                attendance_date = datetime.strptime(date, '%Y-%m-%d').date()
                queryset = queryset.filter(date=attendance_date)
            except ValueError:
                pass
        if status:
            queryset = queryset.filter(status=status)

        return queryset

    @action(detail=False, methods=['post'])
    def check_in(self, request):
        employee = request.user.employee
        now = timezone.now()
        
        # Check if already checked in today
        existing_attendance = Attendance.objects.filter(
            employee=employee,
            date=now.date()
        ).first()

        if existing_attendance and existing_attendance.check_in:
            return Response(
                {"detail": "Already checked in today."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if existing_attendance:
            existing_attendance.check_in = now
            existing_attendance.save()
            serializer = self.get_serializer(existing_attendance)
        else:
            attendance = Attendance.objects.create(
                employee=employee,
                date=now.date(),
                check_in=now
            )
            serializer = self.get_serializer(attendance)

        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def check_out(self, request):
        employee = request.user.employee
        now = timezone.now()
        
        try:
            attendance = Attendance.objects.get(
                employee=employee,
                date=now.date()
            )
        except Attendance.DoesNotExist:
            return Response(
                {"detail": "No check-in record found for today."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if attendance.check_out:
            return Response(
                {"detail": "Already checked out today."},
                status=status.HTTP_400_BAD_REQUEST
            )

        attendance.check_out = now
        attendance.save()
        serializer = self.get_serializer(attendance)
        return Response(serializer.data)

class EmployeeAttendanceView(generics.ListAPIView):
    serializer_class = EmployeeAttendanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        queryset = Attendance.objects.filter(employee_id=employee_id)

        if start_date and end_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__range=[start, end])
            except ValueError:
                pass

        return queryset

class AttendanceReportView(generics.ListAPIView):
    serializer_class = AttendanceReportSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        department = self.request.query_params.get('department', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        queryset = Attendance.objects.all()

        if department:
            queryset = queryset.filter(employee__department_id=department)

        if start_date and end_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__range=[start, end])
            except ValueError:
                pass

        return queryset
