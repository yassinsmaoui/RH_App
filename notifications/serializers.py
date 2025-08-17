from rest_framework import serializers
from .models import NotificationType, Notification, Alert

class NotificationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationType
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class NotificationSerializer(serializers.ModelSerializer):
    notification_type_name = serializers.CharField(source='notification_type.name', read_only=True)
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = Notification
        fields = (
            'id', 'notification_type', 'notification_type_name', 'recipient',
            'sender', 'sender_name', 'subject', 'message', 'status',
            'is_read', 'read_at', 'scheduled_at', 'sent_at',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'sent_at', 'created_at', 'updated_at')

class AlertSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Alert
        fields = (
            'id', 'title', 'message', 'alert_type', 'is_active',
            'is_global', 'target_users', 'target_roles',
            'start_date', 'end_date', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')
