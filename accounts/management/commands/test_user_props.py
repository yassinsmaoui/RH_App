from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Tester la propriété full_name des utilisateurs'

    def handle(self, *args, **options):
        try:
            user = User.objects.get(email='admin@test.com')
            self.stdout.write(f'User trouvé: {user.email}')
            self.stdout.write(f'first_name: "{user.first_name}"')
            self.stdout.write(f'last_name: "{user.last_name}"')
            self.stdout.write(f'full_name: "{user.full_name}"')
            self.stdout.write(f'role: "{user.role}"')
            self.stdout.write(f'department: "{user.department}"')
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Utilisateur non trouvé'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erreur: {e}'))
