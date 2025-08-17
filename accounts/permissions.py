from rest_framework import permissions

class IsHRManager(permissions.BasePermission):
    """Custom permission to only allow HR managers to access the view."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'HR_MANAGER'

class IsDepartmentManager(permissions.BasePermission):
    """Custom permission to only allow department managers to access the view."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'DEPARTMENT_MANAGER'

    def has_object_permission(self, request, view, obj):
        # Department managers can only access objects related to their department
        if hasattr(obj, 'department'):
            return obj.department == request.user.department
        elif hasattr(obj, 'employee'):
            return obj.employee.department == request.user.department
        return False

class IsEmployee(permissions.BasePermission):
    """Custom permission to only allow employees to access their own data."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'EMPLOYEE'

    def has_object_permission(self, request, view, obj):
        # Employees can only access their own data
        if hasattr(obj, 'employee'):
            return obj.employee == request.user.employee
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsOwnerOrHRManager(permissions.BasePermission):
    """Custom permission to only allow owners of an object or HR managers to access it."""
    def has_object_permission(self, request, view, obj):
        # HR managers can access all objects
        if request.user.role == 'HR_MANAGER':
            return True
            
        # Check if the object belongs to the user
        if hasattr(obj, 'employee'):
            return obj.employee == request.user.employee
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsHRManagerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow HR managers to edit but allow read to authenticated users."""
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        # Write permissions are only allowed to HR managers
        return request.user.is_authenticated and request.user.role == 'HR_MANAGER'

class IsDepartmentManagerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow department managers to edit but allow read to authenticated users."""
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        # Write permissions are only allowed to department managers
        return request.user.is_authenticated and request.user.role == 'DEPARTMENT_MANAGER'

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to department managers of the same department
        if hasattr(obj, 'department'):
            return obj.department == request.user.department
        elif hasattr(obj, 'employee'):
            return obj.employee.department == request.user.department
        return False