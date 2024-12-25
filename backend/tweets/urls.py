#backend/tweets/urls.py

from django.urls import path,include
from rest_framework import routers
from.views import TweetViewSet

router = routers.DefaultRouter()
router.register(r'tweets', TweetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]