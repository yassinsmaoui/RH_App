from rest_framework import generics, status, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Department, Position, EmployeeDocument
from .serializers import DepartmentSerializer

User = get_user_model()

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

class PositionViewSet(ModelViewSet):
    queryset = Position.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
