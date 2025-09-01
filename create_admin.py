#!/usr/bin/env python
import os
import django
from django.contrib.auth import get_user_model

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

User = get_user_model()

# Create superuser if it doesn't exist
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@test.com',
        password='admin123',  # Simple password for demo
        first_name='Admin',
        last_name='User'
    )
    print("Superuser 'admin' created successfully!")
else:
    print("Superuser 'admin' already exists.")

print("Login credentials:")
print("Email: admin@test.com")
print("Password: admin123")
