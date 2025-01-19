# backend/users/signals.py

import os
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
from .models import Profile
import logging

logger = logging.getLogger(__name__)

# 1) ユーザー作成時にプロフィールを作る
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        logger.info(f"Profile created for user: {instance.username}")
        print(f"Profile created for user: {instance.username}")

# 2) ユーザー保存後にプロフィールも保存
@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
    logger.info(f"Profile saved for user: {instance.username}")
    print(f"Profile  for user: {instance.username}")

# 3) プロフィール画像を更新する前に古い画像を削除
@receiver(pre_save, sender=Profile)
def delete_old_profile_image(sender, instance, **kwargs):
    """
    Profile が保存される前に、古い画像ファイルを削除する。
    """
    if not instance.pk:
        # 新規作成の場合はまだ pk がないので何もしない
        return

    try:
        old_instance = Profile.objects.get(pk=instance.pk)
    except Profile.DoesNotExist:
        # 既存のレコードがないなら何もしない
        return

    old_file = old_instance.profile_image
    new_file = instance.profile_image

    # もし古いファイルが存在して、かつ新しいファイルと異なり、
    # なおかつ old_file がデフォルト画像でなければ削除
    if (
        old_file 
        and old_file != new_file 
        and old_file.name != "default_profile.png"
    ):
        old_path = os.path.join(settings.MEDIA_ROOT, old_file.name)
        if os.path.exists(old_path):
            os.remove(old_path)
            logger.info(f"Deleted old profile image: {old_path}")
            print(f"Deleted old profile image: {old_path}")
