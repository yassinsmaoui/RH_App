from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import User

class Command(BaseCommand):
    help = 'Crée des utilisateurs de test pour l\'application RH'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Données des utilisateurs de test
        test_users = [
            {
                'email': 'admin@test.com',
                'password': 'password',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'department': 'IT',
                'is_staff': True,
                'is_superuser': True,
                'phone_number': '+33100000001'
            },
            {
                'email': 'hr@test.com',
                'password': 'password',
                'first_name': 'HR',
                'last_name': 'Manager',
                'role': 'hr',
                'department': 'RH',
                'is_staff': True,
                'is_superuser': False,
                'phone_number': '+33100000002'
            },
            {
                'email': 'celeste.yassine@gmail.com',
                'password': 'password',
                'first_name': 'Celeste',
                'last_name': 'Yassine',
                'role': 'employee',
                'department': 'IT',
                'is_staff': False,
                'is_superuser': False,
                'phone_number': '+33100000003'
            },
            {
                'email': 'user@test.com',
                'password': 'password',
                'first_name': 'Regular',
                'last_name': 'User',
                'role': 'employee',
                'department': 'Marketing',
                'is_staff': False,
                'is_superuser': False,
                'phone_number': '+33100000004'
            }
        ]

        for user_data in test_users:
            email = user_data['email']
            
            # Vérifie si l'utilisateur existe déjà
            if User.objects.filter(email=email).exists():
                self.stdout.write(
                    self.style.WARNING(f'L\'utilisateur {email} existe déjà, mise à jour...')
                )
                user = User.objects.get(email=email)
                for key, value in user_data.items():
                    if key != 'password':
                        setattr(user, key, value)
                user.set_password(user_data['password'])
                user.save()
            else:
                # Crée un nouveau utilisateur
                user = User.objects.create_user(
                    email=email,
                    password=user_data['password'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    role=user_data['role'],
                    department=user_data['department'],
                    is_staff=user_data['is_staff'],
                    is_superuser=user_data['is_superuser'],
                    phone_number=user_data['phone_number']
                )
                self.stdout.write(
                    self.style.SUCCESS(f'Utilisateur {email} créé avec succès')
                )

        self.stdout.write(
            self.style.SUCCESS('Tous les utilisateurs de test ont été créés/mis à jour!')
        )
