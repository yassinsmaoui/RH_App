from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Corriger les mots de passe des comptes de test existants'

    def handle(self, *args, **options):
        # Comptes à corriger avec nouveaux mots de passe
        updates = [
            {'email': 'admin@test.com', 'password': 'admin123'},
            {'email': 'hr@test.com', 'password': 'rh123'},
            {'email': 'celeste.yassine@gmail.com', 'password': 'emp123'},
            {'email': 'user@test.com', 'password': 'emp123'},
        ]

        for update_info in updates:
            try:
                user = User.objects.get(email=update_info['email'])
                user.set_password(update_info['password'])
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Mot de passe mis à jour pour {update_info["email"]}')
                )
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'⚠️ Utilisateur {update_info["email"]} non trouvé')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n🔑 Mots de passe mis à jour :'
                f'\n   • admin@test.com : admin123'
                f'\n   • hr@test.com : rh123'
                f'\n   • celeste.yassine@gmail.com : emp123'
                f'\n   • user@test.com : emp123'
            )
        )
