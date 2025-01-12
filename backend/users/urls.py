# backend/users/urls.py

from django.urls import path
from.views import UserCreateView, UserDetailView,FollowAPIView

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='user_register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('user/<int:pk>/follow/', FollowAPIView.as_view(), name='user-follow'),
    path('user/<int:pk>/unfollow/', FollowAPIView.as_view(), name='user-unfollow'),
]