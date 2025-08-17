from rest_framework import generics, status, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Department, Employee
from .serializers import DepartmentSerializer, EmployeeSerializer, EmployeeListSerializer, EmployeeDocumentSerializer

class DepartmentViewSet(ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Department.objects.all()
        name = self.request.query_params.get('name', None)
        code = self.request.query_params.get('code', None)

        if name:
            queryset = queryset.filter(name__icontains=name)
        if code:
            queryset = queryset.filter(code__icontains=code)

        return queryset

class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSerializer
        if self.action == 'upload_document':
            return EmployeeDocumentSerializer
        return EmployeeSerializer

    def get_queryset(self):
        queryset = Employee.objects.all()
        department = self.request.query_params.get('department', None)
        status = self.request.query_params.get('status', None)
        search = self.request.query_params.get('search', None)

        if department:
            queryset = queryset.filter(department_id=department)
        if status:
            queryset = queryset.filter(status=status)
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(employee_id__icontains=search) |
                Q(email__icontains=search)
            )

        return queryset

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        employee = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            document = serializer.validated_data['document']
            document_type = serializer.validated_data['document_type']
            
            # Save document to employee
            if document_type == 'resume':
                employee.resume = document
            elif document_type == 'contract':
                employee.contract = document
            elif document_type == 'id_proof':
                employee.id_proof = document
            
            employee.save()
            return Response(
                {'message': f'{document_type} uploaded successfully'},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DepartmentEmployeesView(generics.ListAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        department_id = self.kwargs['department_id']
        return Employee.objects.filter(department_id=department_id)
