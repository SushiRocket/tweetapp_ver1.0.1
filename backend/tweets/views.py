#backend/tweets/views.py

from rest_framework import viewsets
from.models import Tweet
from.serializers import TweetSerializers

# Create your views here.

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all().order_by('-created_at')
    serializer_class = TweetSerializers
