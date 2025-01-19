# backend/tweets/models.py

from django.db import models
from django.contrib.auth.models import User

class Tweet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tweets')
    content = models.CharField(max_length=280)
    created_at = models.DateTimeField(auto_now_add=True)
    hashtags = models.ManyToManyField('Hashtag', blank=True, related_name='tweets')# モデル同士を参照するときの「遅延読み込み（lazy loading）」 のため

    def __str__(self):
        return f"{ self.user.username }: { self.content[:20] }"  # 管理画面などで表示するとき用
    
class Hashtag(models.Model):
    name = models.CharField(max_length=50, unique=True) # unique=trueでタグを1つに集約
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Comment(models.Model):
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=280)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} on {self.tweet.id}: {self.text[:30]}"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey('Tweet', on_delete=models.CASCADE, related_name='likes')

    class Meta:
        unique_together = ('user', 'tweet')

    def __str__(self):
        return f"{self.user.username} likes {self.tweet.id}"