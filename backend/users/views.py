# backend/users/views.py

from rest_framework import generics,permissions,status,viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from.serializers import UserSerializer,ProfileSerializer
from.models import Follow,Profile
from notifications.models import Notification
from rest_framework.permissions import IsAuthenticatedOrReadOnly,AllowAny,IsAuthenticated
from tweets.models import Tweet
from tweets.serializers import TweetSerializer
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    authentication_classes = []

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class FollowAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        try:
            user_to_follow = User.objects.get(pk=pk)
            if user_to_follow == request.user:
                return Response({'error': 'You cannot follow yourself.' }, status=status.HTTP_400_BAD_REQUEST)
            
            follow, created = Follow.objects.get_or_create(
                follower=request.user,
                following=user_to_follow
            )
            if not created:
                return Response({'status': f'Already following.'}, status=status.HTTP_200_OK)
            
            Notification.objects.create(
                recipient=user_to_follow,
                sender=request.user,
                message=f"{request.user.username} started following you."
            )

            return Response({'status': f'You are now following{user_to_follow.username}.'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, pk=None):
        try:
            user_to_unfollow = User.objects.get(pk=pk)
            if user_to_unfollow == request.user:
                return Response({'error': 'You cannot unfollow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
            
            delete, _ = Follow.objects.filter(
                follower=request.user,
                following=user_to_unfollow
            ).delete()
            if delete == 0:
                return Response({'error': 'You are not following this user.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'status': f'You have unfollowed {user_to_unfollow.username}.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            tweets = Tweet.objects.filter(user=user).order_by('created_at')
            tweet_serializer = TweetSerializer(tweets, many=True)

            profile_data = {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined,
                'tweets': tweet_serializer.data,
                'followers': user.followers.count(),
                'following': user.following.count(),
            }

            return Response(profile_data, status=200)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)
        
class UserSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '') #クエリパラメータqの取得
        users = User.objects.filter(username__icontains=query) #部分一致検索
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class ProfileImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
    def post(self, request):
        return self.put(request)