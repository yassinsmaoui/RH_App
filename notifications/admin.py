from django.contrib import admin
from .models import NotificationType, Notification, Alert

@admin.register(NotificationType)
class NotificationTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'priority', 'is_active', 'created_at']
    list_filter = ['category', 'priority', 'is_active']
    search_fields = ['name', 'description']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['subject', 'recipient', 'notification_type', 'status', 'is_read', 'created_at']
    list_filter = ['status', 'is_read', 'notification_type', 'created_at']
    search_fields = ['subject', 'message', 'recipient__email']
    readonly_fields = ['sent_at', 'read_at']

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['title', 'alert_type', 'is_active', 'is_global', 'created_by', 'created_at']
    list_filter = ['alert_type', 'is_active', 'is_global', 'created_at']
    search_fields = ['title', 'message']
    readonly_fields = ['created_at', 'updated_at']
