#backend/tweets/views.py

from rest_framework import viewsets
from.models import Tweet
from.serializers import TweetSerializers
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from.permissions import IsOwnerOrReadOnly

# Create your views here.

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all().order_by('-created_at')
    serializer_class = TweetSerializers
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    #ツイートが作成される際に、シリアライザーに現在のリクエストユーザー (self.request.user) を自動的に設定します。
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
