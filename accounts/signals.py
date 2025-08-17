from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from employees.models import Employee
from leave.models import LeaveBalance, LeaveType
from .utils import generate_employee_id, send_email_notification

User = get_user_model()

@receiver(post_save, sender=User)
def create_employee_profile(sender, instance, created, **kwargs):
    """Create employee profile when a new user is created with role 'EMPLOYEE'."""
    if created and instance.role == 'EMPLOYEE':
        # Generate employee ID
        employee_id = generate_employee_id()
        
        # Create employee profile
        employee = Employee.objects.create(
            user=instance,
            employee_id=employee_id,
            first_name=instance.first_name,
            last_name=instance.last_name,
            email=instance.email,
            department=instance.department
        )
        
        # Initialize leave balances
        leave_types = LeaveType.objects.all()
        for leave_type in leave_types:
            LeaveBalance.objects.create(
                employee=employee,
                leave_type=leave_type,
                total_days=leave_type.default_days,
                used_days=0,
                year=timezone.now().year
            )
        
        # Send welcome email
        context = {
            'user': instance,
            'employee_id': employee_id
        }
        send_email_notification(
            subject='Welcome to HR Management System',
            template_name='accounts/email/welcome.html',
            context=context,
            recipient_list=[instance.email]
        )

@receiver(pre_save, sender=User)
def update_employee_profile(sender, instance, **kwargs):
    """Update employee profile when user details are updated."""
    if instance.pk:  # Only for existing users
        try:
            old_instance = User.objects.get(pk=instance.pk)
            
            # If email changed, update employee email
            if old_instance.email != instance.email:
                Employee.objects.filter(user=instance).update(email=instance.email)
            
            # If name changed, update employee name
            if (old_instance.first_name != instance.first_name or 
                old_instance.last_name != instance.last_name):
                Employee.objects.filter(user=instance).update(
                    first_name=instance.first_name,
                    last_name=instance.last_name
                )
            
            # If department changed, update employee department
            if old_instance.department != instance.department:
                Employee.objects.filter(user=instance).update(
                    department=instance.department
                )
                
                # Notify department change
                context = {
                    'user': instance,
                    'old_department': old_instance.department,
                    'new_department': instance.department
                }
                send_email_notification(
                    subject='Department Change Notification',
                    template_name='accounts/email/department_change.html',
                    context=context,
                    recipient_list=[instance.email]
                )
        
        except User.DoesNotExist:
            pass

@receiver(post_delete, sender=User)
def cleanup_employee_data(sender, instance, **kwargs):
    """Clean up related data when a user is deleted."""
    # The employee profile will be automatically deleted due to CASCADE
    # But we might want to archive some data or perform additional cleanup
    
    # For example, we might want to archive the employee's performance reviews
    from performance.models import PerformanceReview
    reviews = PerformanceReview.objects.filter(employee__user=instance)
    
    # Archive reviews or perform other cleanup tasks
    for review in reviews:
        # Here you might want to copy the review data to an archive table
        # or perform other cleanup operations
        pass

@receiver(post_save, sender=Employee)
def send_employee_creation_notification(sender, instance, created, **kwargs):
    """Send notification when a new employee is created."""
    if created:
        # Notify HR Manager
        hr_managers = User.objects.filter(role='HR_MANAGER')
        context = {
            'employee': instance
        }
        
        for hr_manager in hr_managers:
            send_email_notification(
                subject='New Employee Added',
                template_name='accounts/email/new_employee_notification.html',
                context=context,
                recipient_list=[hr_manager.email]
            )
        
        # Notify Department Manager
        if instance.department and instance.department.manager:
            send_email_notification(
                subject='New Employee Added to Your Department',
                template_name='accounts/email/new_department_employee.html',
                context=context,
                recipient_list=[instance.department.manager.email]
            )