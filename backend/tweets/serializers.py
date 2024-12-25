#backend/tweets/serializers.py

from rest_framework import serializers
from.models import Tweet

class TweetSerializers(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ['id', 'content', 'created_at']