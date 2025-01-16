#backend/tweets/urls.py

from django.urls import path,include
from rest_framework import routers
from.views import TweetViewSet,FeedView,CommentViewSet

router = routers.DefaultRouter()
router.register(r'tweets', TweetViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('feed/', FeedView.as_view(), name='feed'),
]