#backend/tweets/urls.py

from django.urls import path,include
from rest_framework import routers
from.views import TweetViewSet,FeedView,CommentViewSet,LikeAPIView,TrendingHashtagsAPIView,HashtagDetailAPIView

router = routers.DefaultRouter()
router.register(r'tweets', TweetViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('feed/', FeedView.as_view(), name='feed'),
    path('tweets/<int:tweet_id>/like/', LikeAPIView.as_view(), name='tweet-like'),
    path('tweets/<int:tweet_id>/unlike/', LikeAPIView.as_view(), name='tweet-unlike'),
    path('tweets/trending/', TrendingHashtagsAPIView.as_view(), name='trending_hashtags'),
    path('tweets/hashtags/<str:tag_name>/', HashtagDetailAPIView.as_view(), name='hashtag_detail'),
    path('', include(router.urls)),
]