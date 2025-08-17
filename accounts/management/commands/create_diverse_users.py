from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Créer des utilisateurs diversifiés pour tester l\'application'

    def handle(self, *args, **options):
        users_data = [
            # === ADMINISTRATEURS ===
            {
                'email': 'directeur@company.com',
                'password': 'admin123',
                'first_name': 'Jean-Pierre',
                'last_name': 'Rousseau',
                'role': 'admin',
                'department': 'Direction Générale',
                'phone_number': '+33145789632',
                'is_staff': True,
                'is_superuser': True
            },
            {
                'email': 'dg@company.com',
                'password': 'admin123',
                'first_name': 'Catherine',
                'last_name': 'Moreau',
                'role': 'admin',
                'department': 'Direction Générale',
                'phone_number': '+33145987654',
                'is_staff': True,
                'is_superuser': True
            },
            
            # === RESPONSABLES RH ===
            {
                'email': 'rh.manager@company.com',
                'password': 'rh123',
                'first_name': 'Sophie',
                'last_name': 'Lemaire',
                'role': 'hr',
                'department': 'Ressources Humaines',
                'phone_number': '+33145678901',
                'is_staff': True
            },
            {
                'email': 'recrutement@company.com',
                'password': 'rh123',
                'first_name': 'Marc',
                'last_name': 'Dubois',
                'role': 'hr',
                'department': 'Ressources Humaines',
                'phone_number': '+33145123789',
                'is_staff': True
            },
            {
                'email': 'formation@company.com',
                'password': 'rh123',
                'first_name': 'Isabelle',
                'last_name': 'Vincent',
                'role': 'hr',
                'department': 'Formation & Développement',
                'phone_number': '+33145456123',
                'is_staff': True
            },
            
            # === EMPLOYÉS IT ===
            {
                'email': 'dev.senior@company.com',
                'password': 'emp123',
                'first_name': 'Alexandre',
                'last_name': 'Martin',
                'role': 'employee',
                'department': 'Informatique',
                'phone_number': '+33145321654'
            },
            {
                'email': 'devops@company.com',
                'password': 'emp123',
                'first_name': 'Laura',
                'last_name': 'Bernard',
                'role': 'employee',
                'department': 'Informatique',
                'phone_number': '+33145987321'
            },
            {
                'email': 'ux.designer@company.com',
                'password': 'emp123',
                'first_name': 'Thomas',
                'last_name': 'Petit',
                'role': 'employee',
                'department': 'Design & UX',
                'phone_number': '+33145654987'
            },
            
            # === EMPLOYÉS MARKETING ===
            {
                'email': 'marketing.manager@company.com',
                'password': 'emp123',
                'first_name': 'Amélie',
                'last_name': 'Garcia',
                'role': 'employee',
                'department': 'Marketing',
                'phone_number': '+33145789123'
            },
            {
                'email': 'social.media@company.com',
                'password': 'emp123',
                'first_name': 'Kevin',
                'last_name': 'Lopez',
                'role': 'employee',
                'department': 'Communication',
                'phone_number': '+33145852741'
            },
            
            # === EMPLOYÉS VENTES ===
            {
                'email': 'commercial@company.com',
                'password': 'emp123',
                'first_name': 'Pierre',
                'last_name': 'Durand',
                'role': 'employee',
                'department': 'Commercial',
                'phone_number': '+33145963852'
            },
            {
                'email': 'ventes@company.com',
                'password': 'emp123',
                'first_name': 'Nathalie',
                'last_name': 'Roux',
                'role': 'employee',
                'department': 'Ventes',
                'phone_number': '+33145741963'
            },
            
            # === EMPLOYÉS FINANCE ===
            {
                'email': 'comptable@company.com',
                'password': 'emp123',
                'first_name': 'François',
                'last_name': 'Blanc',
                'role': 'employee',
                'department': 'Comptabilité',
                'phone_number': '+33145258741'
            },
            {
                'email': 'controle.gestion@company.com',
                'password': 'emp123',
                'first_name': 'Marie-Claire',
                'last_name': 'Bonnet',
                'role': 'employee',
                'department': 'Contrôle de Gestion',
                'phone_number': '+33145369852'
            },
            
            # === EMPLOYÉS OPÉRATIONS ===
            {
                'email': 'operations@company.com',
                'password': 'emp123',
                'first_name': 'David',
                'last_name': 'Leroy',
                'role': 'employee',
                'department': 'Opérations',
                'phone_number': '+33145147258'
            },
            {
                'email': 'logistique@company.com',
                'password': 'emp123',
                'first_name': 'Sandrine',
                'last_name': 'Moreau',
                'role': 'employee',
                'department': 'Logistique',
                'phone_number': '+33145896374'
            },
            
            # === ASSISTANTS ET SUPPORT ===
            {
                'email': 'assistante@company.com',
                'password': 'emp123',
                'first_name': 'Céline',
                'last_name': 'Faure',
                'role': 'employee',
                'department': 'Administration',
                'phone_number': '+33145753951'
            },
            {
                'email': 'support@company.com',
                'password': 'emp123',
                'first_name': 'Julien',
                'last_name': 'Chevalier',
                'role': 'employee',
                'department': 'Support Client',
                'phone_number': '+33145159357'
            },
            
            # === STAGIAIRES ET JUNIORS ===
            {
                'email': 'stagiaire.it@company.com',
                'password': 'emp123',
                'first_name': 'Lucas',
                'last_name': 'Girard',
                'role': 'employee',
                'department': 'Informatique',
                'phone_number': '+33145357159'
            },
            {
                'email': 'junior.marketing@company.com',
                'password': 'emp123',
                'first_name': 'Emma',
                'last_name': 'Robin',
                'role': 'employee',
                'department': 'Marketing',
                'phone_number': '+33145951753'
            }
        ]

        created_count = 0
        updated_count = 0

        with transaction.atomic():
            for user_data in users_data:
                email = user_data['email']
                password = user_data.pop('password')
                
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults=user_data
                )
                
                if created:
                    user.set_password(password)
                    user.save()
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ Utilisateur {email} créé avec succès')
                    )
                else:
                    # Mettre à jour les informations si l'utilisateur existe déjà
                    for key, value in user_data.items():
                        setattr(user, key, value)
                    user.set_password(password)
                    user.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'🔄 Utilisateur {email} mis à jour')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 Terminé ! {created_count} utilisateurs créés, {updated_count} mis à jour.'
            )
        )
        
        # Afficher un résumé par rôle
        admin_count = User.objects.filter(role='admin').count()
        hr_count = User.objects.filter(role='hr').count()
        employee_count = User.objects.filter(role='employee').count()
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n📊 Résumé des comptes :'
                f'\n   👑 Administrateurs : {admin_count}'
                f'\n   👥 RH : {hr_count}'
                f'\n   👤 Employés : {employee_count}'
                f'\n   📧 Total : {admin_count + hr_count + employee_count}'
            )
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n🔑 Mots de passe par défaut :'
                f'\n   • Admins : admin123'
                f'\n   • RH : rh123'
                f'\n   • Employés : emp123'
            )
        )
