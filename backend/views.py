from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.http import require_http_methods

def home_view(request):
    """
    Vue d'accueil pour l'application RH
    """
    return JsonResponse({
        'message': 'Bienvenue dans l\'application de gestion RH',
        'version': '1.0.0',
        'api_endpoints': {
            'admin': '/admin/',
            'api_schema': '/api/schema/',
            'authentication': '/api/auth/',
            'employees': '/api/employees/',
            'attendance': '/api/attendance/',
            'leave': '/api/leave/',
            'performance': '/api/performance/',
            'payroll': '/api/payroll/',
            'notifications': '/api/notifications/',
        },
        'frontend': {
            'note': 'Le frontend React doit être servi séparément sur le port 5173',
            'dev_server': 'npm run dev dans le dossier frontend'
        }
    })

@require_http_methods(["GET"])
def api_status(request):
    """
    Endpoint pour vérifier le statut de l'API
    """
    return JsonResponse({
        'status': 'active',
        'message': 'API HR Management System fonctionnelle'
    })
