#backend/tweets/urls.py

from django.urls import path,include
from rest_framework import routers
from.views import TweetViewSet,FeedView

router = routers.DefaultRouter()
router.register('tweets', TweetViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('feed/', FeedView.as_view(), name='feed'),
]