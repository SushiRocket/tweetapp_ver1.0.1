# backend/users/views.py

from rest_framework import generics,permissions,status,viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from.serializers import UserSerializer
from.models import Follow

# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

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
            return Response({'status': f'You are now following{user_to_follow.username}.'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    def deleted(self, request, pk=None):
        try:
            user_to_unfollow = User.object.get(pk=pk)
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
        