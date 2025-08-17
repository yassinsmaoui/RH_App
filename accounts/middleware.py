import json
import logging
from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import connection

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    """Middleware to log all requests and responses."""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Code to be executed for each request before the view
        start_time = timezone.now()
        
        # Log request details
        self.log_request(request)
        
        # Get response
        response = self.get_response(request)
        
        # Code to be executed for each request/response after the view
        duration = timezone.now() - start_time
        
        # Log response details
        self.log_response(request, response, duration)
        
        return response

    def log_request(self, request):
        user = request.user.email if request.user.is_authenticated else 'Anonymous'
        
        log_data = {
            'timestamp': timezone.now().isoformat(),
            'user': user,
            'method': request.method,
            'path': request.path,
            'query_params': dict(request.GET.items()),
            'remote_addr': request.META.get('REMOTE_ADDR'),
            'user_agent': request.META.get('HTTP_USER_AGENT')
        }
        
        # Don't log passwords or sensitive data
        if request.method in ['POST', 'PUT', 'PATCH']:
            body = request.body
            if body:
                try:
                    body_data = json.loads(body)
                    # Remove sensitive fields
                    if 'password' in body_data:
                        body_data['password'] = '[FILTERED]'
                    if 'token' in body_data:
                        body_data['token'] = '[FILTERED]'
                    log_data['body'] = body_data
                except json.JSONDecodeError:
                    log_data['body'] = '[BINARY DATA]'

        logger.info(f'Request: {json.dumps(log_data)}')

    def log_response(self, request, response, duration):
        user = request.user.email if request.user.is_authenticated else 'Anonymous'
        
        log_data = {
            'timestamp': timezone.now().isoformat(),
            'user': user,
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
            'duration': str(duration),
            'query_count': len(connection.queries)
        }

        logger.info(f'Response: {json.dumps(log_data)}')

class LastActivityMiddleware:
    """Middleware to track user's last activity."""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Update last activity timestamp for authenticated users
        if request.user.is_authenticated:
            try:
                request.user.last_activity = timezone.now()
                request.user.save(update_fields=['last_activity'])
            except Exception as e:
                logger.error(f'Error updating last activity for user {request.user.email}: {str(e)}')
        
        return response

class RoleBasedAccessMiddleware:
    """Middleware to handle role-based access control."""
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.public_paths = [
            '/admin/',
            '/api/auth/',
            '/api/docs/',
            '/api/schema/',
        ]

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Skip middleware for public paths
        if any(request.path.startswith(path) for path in self.public_paths):
            return None

        # Check if user is authenticated
        if not request.user.is_authenticated:
            logger.warning(f'Unauthenticated access attempt to {request.path}')
            return JsonResponse({'error': 'Authentication required'}, status=401)

        # Add role information to request
        request.role = request.user.role

        # Get required roles from view if specified
        required_roles = getattr(view_func, 'required_roles', None)
        if required_roles and request.role not in required_roles:
            logger.warning(
                f'Access denied for user {request.user.email} with role {request.role} '
                f'to view requiring roles {required_roles}'
            )
            return JsonResponse({'error': 'Permission denied'}, status=403)

        # Get required permissions from view if specified
        required_permissions = getattr(view_func, 'required_permissions', None)
        if required_permissions:
            user_permissions = set(request.user.get_all_permissions())
            missing_permissions = set(required_permissions) - user_permissions
            
            if missing_permissions:
                logger.warning(
                    f'Access denied for user {request.user.email} missing permissions: '
                    f'{missing_permissions}'
                )
                return JsonResponse({'error': 'Permission denied'}, status=403)

        return None