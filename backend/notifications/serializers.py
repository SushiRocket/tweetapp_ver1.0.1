from rest_framework import serializers
from.models import Notification

class NotificationSerializer(serializers.Modelserializer):
    class Meta:
        model = Notification
        field = ['id', 'recipient', 'sender', 'message', 'created_at', 'is_read']