# backend/tweets/routing.py

from django.urls import path
from.consumers import TweetConsumer

websocket_urlpatterns = [
    path('ws/tweets/', TweetConsumer.as_asgi()),
]