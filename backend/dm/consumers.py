# backend/dm/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async
from.models import DirectMessage

class DMConsumer(AsyncWebsocketConsumer):
    #1対1のDMチャット用のconsumer
    #クライアントからのメッセージを受け取り、相手ユーザーと自分にキャスト

    async def connect(self):
        #urlに相手ユーザーのIDが含まれる想定
        self.other_user_id = self.scope['url_route']['kwargs']['user_id']
        self.user = self.scope['user']
        print(f"WebSocket connected. User: {self.scope['user']}, Is Authenticated: {self.scope['user'].is_authenticated}")
    

        if self.user.is_anonymous:
            await self.close()

        else:
            # ルーム名を2ユーザーのIDから作成し、一意のチャットグループを作る
            sorted_ids = sorted([self.user.id, int(self.other_user_id)])
            self.room_name = f"dm_{sorted_ids[0]}_{sorted_ids[1]}"

            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )
            await self.accept()

    async def disconect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        
        # Channels が内部で「text_data=...」という形で呼び出すので、
        # その引数を受け取れるようにする。
        if text_data is not None:
            print(">>>[DMConsumer] recieve() called with", text_data)
            data = json.loads(text_data)
            message_content = data.get('message')
            # メッセージをDBに保存
            dm_id = await self.save_dm(message_content)
            # グループにブロードキャスト
            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type': 'dm_message',
                    'sender_id': self.user.id,
                    'dm_id': dm_id,
                    'content': message_content,
                }
            )

    async def dm_message(self, event):
        print(">>>[DMConsumer] dm_message() broadcast", event)
        # クライアントにメッセージを送信
        dm_data = {
            'sender_id': event['sender_id'],
            'dm_id': event['dm_id'],
            'content': event['content'],
        }
        await self.send(json.dumps(dm_data))

    @sync_to_async
    def save_dm(self, content):
        #DBに保存
        recipient_id = self.other_user_id
        print(f"Saving DM: {self.user.id} -> {recipient_id}, content={content}")
        dm = DirectMessage.objects.create(
            sender_id=self.user.id,
            recipient_id = recipient_id,
            content = content
        )
        return dm.id