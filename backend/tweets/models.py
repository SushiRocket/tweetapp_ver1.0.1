# backend/tweets/models.py

from django.db import models
from django.contrib.auth.models import User

class Tweet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tweets')
    content = models.CharField(max_length=280)   # ツイート本文(280文字まで)
    created_at = models.DateTimeField(auto_now_add=True)  # 作成日時

    def __str__(self):
        return f"{ self.user.username }: { self.content[:20] }"  # 管理画面などで表示するとき用
