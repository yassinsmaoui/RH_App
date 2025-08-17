from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import datetime, timedelta
from leave.models import LeaveRequest
from performance.models import PerformanceReview
from employees.models import Employee
from .models import Notification, NotificationType

@receiver(post_save, sender=LeaveRequest)
def notify_leave_request(sender, instance, created, **kwargs):
    """Send notification when a leave request is created or updated"""
    if created:
        # Notify HR about new leave request
        try:
            notification_type = NotificationType.objects.get(
                category='leave', 
                name='New Leave Request'
            )
            
            # Send to HR users
            from django.contrib.auth import get_user_model
            User = get_user_model()
            hr_users = User.objects.filter(role='hr')
            
            for hr_user in hr_users:
                Notification.objects.create(
                    notification_type=notification_type,
                    recipient=hr_user,
                    subject=f"New Leave Request from {instance.employee.user.get_full_name()}",
                    message=f"{instance.employee.user.get_full_name()} has requested {instance.leave_type.name} from {instance.start_date} to {instance.end_date}."
                )
        except NotificationType.DoesNotExist:
            pass
    
    elif instance.status in ['approved', 'rejected']:
        # Notify employee about leave request status
        try:
            notification_type = NotificationType.objects.get(
                category='leave',
                name='Leave Request Update'
            )
            
            status_text = "approved" if instance.status == 'approved' else "rejected"
            Notification.objects.create(
                notification_type=notification_type,
                recipient=instance.employee.user,
                subject=f"Leave Request {status_text.title()}",
                message=f"Your leave request from {instance.start_date} to {instance.end_date} has been {status_text}."
            )
        except NotificationType.DoesNotExist:
            pass

@receiver(post_save, sender=PerformanceReview)
def notify_performance_review(sender, instance, created, **kwargs):
    """Send notification when a performance review is created or completed"""
    if created:
        try:
            notification_type = NotificationType.objects.get(
                category='performance',
                name='Performance Review Scheduled'
            )
            
            Notification.objects.create(
                notification_type=notification_type,
                recipient=instance.employee.user,
                subject="Performance Review Scheduled",
                message=f"A {instance.review_type} performance review has been scheduled for you."
            )
        except NotificationType.DoesNotExist:
            pass
    
    elif instance.status == 'completed':
        try:
            notification_type = NotificationType.objects.get(
                category='performance',
                name='Performance Review Completed'
            )
            
            Notification.objects.create(
                notification_type=notification_type,
                recipient=instance.employee.user,
                subject="Performance Review Completed",
                message=f"Your {instance.review_type} performance review has been completed."
            )
        except NotificationType.DoesNotExist:
            pass
