# backend/tweets/models.py

from django.db import models

class Tweet(models.Model):
    text = models.CharField(max_length=280)   # ツイート本文(280文字まで)
    created_at = models.DateTimeField(auto_now_add=True)  # 作成日時

    def __str__(self):
        return self.text[:20]  # 管理画面などで表示するとき用
