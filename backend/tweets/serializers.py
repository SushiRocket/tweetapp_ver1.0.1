from rest_framework import serializers
from.models import Tweet

class TweetSerializers(serializers.ModelSerializer):
    class Mete:
        model = Tweet
        fiels = ['id', 'content', 'created_at']