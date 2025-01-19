import os
from django.contrib.auth.models import User
from django.db import models

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
    
def upload_profile_image_path(instance, filename):
    
    # ユーザーIDごとに専用フォルダを作り、ファイル名をprofile.jpgに固定。
    # 同じユーザーが再アップロードすると上書きされる想定。
    
    return f"profile_images/user_{instance.user.id}/profile.jpg"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_image = models.ImageField(upload_to=upload_profile_image_path, default='default_profile.png')

    def __str__(self):
        return self.user.username