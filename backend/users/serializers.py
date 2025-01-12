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
        return obj.followers.count()
    
    def get_following(self, obj):
        return obj.followoing.count()

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password'],
            email = validated_data.get('email', ''),
            first_name = validated_data.get('first_name', ''),
            last_name = validated_data.get('last_name', ''),
        )
        return user