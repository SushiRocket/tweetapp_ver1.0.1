from rest_framework import serializers
from.models import DirectMessage

class DirectMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')
    recipient_username = serializers.ReadOnlyField(source='recipient.username')

    class Meta:
        model = DirectMessage
        fields = ['id', 'sender', 'sender_username', 'repicient', 'repicient_username', 'text', 'created_at']
        read_only_fields = ['sender', 'sender_name', 'created_at']