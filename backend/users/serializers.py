#backend/users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from.models import Follow

# Create your models here.

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ('id', 'follower', 'following', 'created_at')

class UserSerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id','username','password','email','first_name','last_name', 'followers', 'following')

    def get_followers(self, obj):
        return {
            "count": obj.followers.count(),
            "users": [f.follower.id for f in obj.followers.all()]
        }
    
    def get_following(self, obj):
        return {
            "count": obj.following.count(),
            "users": [f.following.id for f in obj.following.all()]
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password'],
            email = validated_data.get('email', ''),
            first_name = validated_data.get('first_name', ''),
            last_name = validated_data.get('last_name', ''),
        )
        return user