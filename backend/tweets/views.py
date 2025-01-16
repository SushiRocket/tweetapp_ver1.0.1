#backend/tweets/views.py

from rest_framework import viewsets
from.models import Tweet
from.serializers import TweetSerializers
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from.permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all().order_by('-created_at')
    serializer_class = TweetSerializers
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    #ツイートが作成される際に、シリアライザーに現在のリクエストユーザー (self.request.user) を自動的に設定します。
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FeedView(APIView):

    # フォローしているユーザーのツイートを取得

    permission_classes = [IsOwnerOrReadOnly]

    def get(self, request):
        user = request.user
        following_users = user.user.following.value_list('following', flat=True)
        tweets = Tweet.objects.filter(user__id__in=following_users).order_by('-created_at')
        serializer = TweetSerializers(tweets, many=True)
        return Response(serializer.date)