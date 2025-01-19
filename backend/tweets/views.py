#backend/tweets/views.py

from rest_framework import viewsets,status
from.models import Tweet,Comment,Like,Hashtag
from.serializers import TweetSerializer,CommentSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
from.permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .utils import extract_and_link_hashtags
from django.db.models import Count
from django.shortcuts import get_object_or_404
# Create your views here.

class HashtagDetailAPIView(APIView):
    # 指定ハッシュタグに紐づくツイート一覧を返す
    # GET /api/hashtags/<tag_name>/
    def get(self, request, tag_name):
        normalized_name = tag_name.lower()
        hashtag = get_object_or_404(Hashtag, name=normalized_name)
        tweets = hashtag.tweets.order_by('-created_at')
        serializer = TweetSerializer(tweets, many=True)
        return Response({
            'hashtag': hashtag.name,
            'tweet_count': tweets.count(),
            'tweets': serializer.data
        })

class TrendingHashtagsAPIView(APIView):
    def get(self, request):
        hashtags = Hashtag.objects.annotate(
            tweet_count=Count('tweets')
        ).order_by('-tweet_count')[:10]

        data = []
        for tag in hashtags:
            data.append({
                'name': tag.name,
                'tweet_count': tag.tweets.count(),
            })
        return Response(data)
    
class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all().order_by('-created_at')
    serializer_class = TweetSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    #ツイートが作成される際に、シリアライザーに現在のリクエストユーザー (self.request.user) を自動的に設定します。
    def perform_create(self, serializer):
        tweet = serializer.save(user=self.request.user)
        #ハッシュタグの抽出・連携
        extract_and_link_hashtags(tweet)
        # WebSocket に通知
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "tweets",
            {
                'type': 'tweet_message',
                'message': 'new_tweet',
                'tweet': {
                    'id': tweet.id,
                    'content': tweet.content,
                    'user': tweet.user.username,
                    'created_at': str(tweet.created_at),
                }
            }
        )

class FeedView(APIView):

    # フォローしているユーザーのツイートを取得

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        following_users = user.user.following.values_list('following', flat=True)
        tweets = Tweet.objects.filter(user__id__in=following_users).order_by('-created_at')
        serializer = TweetSerializer(tweets, many=True)
        return Response(serializer.data)
    
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, tweet_id):
        try:
            tweet = Tweet.objects.get(pk=tweet_id)
            like, created = Like.objects.get_or_create(user=request.user, tweet=tweet)

            if not created:
                return Response({'message': 'You already liked this tweet.'}, status=status.HTTP_200_OK)
            
            return Response({'message': 'Tweet liked successfully.'}, status=status.HTTP_201_CREATED)
        except Tweet.DoesNotExist:
            return Response({'error': 'Tweet not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, tweet_id):
        try:
            tweet = Tweet.objects.get(pk=tweet_id)
            like = Like.objects.filter(user=request.user, tweet=tweet)

            if not like.exists():
                return Response({'error': 'You have not liked this tweet.'}, status=status.HTTP_200_OK)
            
            like.delete()
            return Response({'message': 'Like removed successfully.'}, status=status.HTTP_200_OK)
        except Tweet.DoesNotExist:
            return Response({'error': 'Tweet not found.'}, status=status.HTTP_404_NOT_FOUND)