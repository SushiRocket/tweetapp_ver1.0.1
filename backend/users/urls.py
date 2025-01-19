# backend/users/urls.py

from django.urls import path,include
from rest_framework import routers
from.views import UserCreateView, UserDetailView,FollowAPIView,UserViewSet,UserProfileView,UserSearchView,ProfileImageUploadView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserCreateView.as_view(), name='user_register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('user/<int:pk>/follow/', FollowAPIView.as_view(), name='user-follow'),
    path('user/<int:pk>/unfollow/', FollowAPIView.as_view(), name='user-unfollow'),
    path('profile/image/', ProfileImageUploadView.as_view(), name='profile_image_upload'),
    path('profile/<str:username>/', UserProfileView.as_view(), name='user_profile'),
    path('search/', UserSearchView.as_view(), name='user_serch'),
]