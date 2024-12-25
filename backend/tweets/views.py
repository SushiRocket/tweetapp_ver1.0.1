from rest_framework import generics
from.models import Tweet
from.serializers import TweetSerializers

# Create your views here.

class TweetListCreateView(generics.ListCreateAPIView):
    queryset = Tweet.objects.all().order_by('-created_at')
    serializer_class = TweetSerializers
