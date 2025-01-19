# backend/tweets/utils.py

import re
from.models import Hashtag

HASHTAG_PATTERN = re.compile(r'#(\w+)')

def extract_and_link_hashtags(tweet_instance):
    
    # ツイート本文からハッシュタグ(#xxx)を抜き出し、
    # Hashtag を作成 or 取得して Tweet の hashtags に紐づける

    content = tweet_instance.content
    tag_names = HASHTAG_PATTERN.findall(content)

    for tag_name in tag_names:
        # 大文字小文字を区別するかは運用次第だが、ここでは同一視する場合
        normalized_name = tag_name.lower()
        hashtag_obj, created = Hashtag.objects.get_or_create(name=normalized_name)
        # ツイートに関連付け
        tweet_instance.hashtags.add(hashtag_obj)