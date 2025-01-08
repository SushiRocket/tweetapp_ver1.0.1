# backend/users/urls.py

from django.urls import path
from.views import UserCreateView, UserDetailView

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='user_register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
]