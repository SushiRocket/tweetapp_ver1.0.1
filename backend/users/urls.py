from django.urls import path
from.views import UserCreateView, UserDtailView

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='user_register'),
    path('user/', UserDtailView.as_view(), name='user_detail'),
]