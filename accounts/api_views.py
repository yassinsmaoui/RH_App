from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    API pour l'authentification des utilisateurs
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'error': 'Email et mot de passe requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=email, password=password)
    
    if user is not None and user.is_active:
        # Mise à jour de la dernière connexion
        update_last_login(None, user)
        
        # Générer le token JWT
        refresh = RefreshToken.for_user(user)
        
        # Construire l'objet utilisateur
        user_data = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'name': user.full_name,
            'role': user.role,
            'department': user.department,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        }
        
        print(f"DEBUG: user_data = {user_data}")  # Log de debug
        
        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user_data
        }
        
        print(f"DEBUG: response_data = {response_data}")  # Log de debug
        
        return Response(response_data, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Email ou mot de passe incorrect'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def user_profile(request):
    """
    API pour récupérer le profil utilisateur
    """
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Non authentifié'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def check_auth(request):
    """
    API pour vérifier l'état d'authentification
    """
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'name': request.user.full_name,
                'role': request.user.role,
                'department': request.user.department,
                'is_staff': request.user.is_staff,
                'is_superuser': request.user.is_superuser
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'authenticated': False
        }, status=status.HTTP_200_OK)
