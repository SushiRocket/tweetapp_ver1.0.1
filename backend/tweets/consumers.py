# backend/tweets/consumer.py

import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class TweetConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print(f"WebSocket connention attempt: {self.scope['client']}")
        #グループに参加
        await self.channel_layer.group_add(
            "tweets",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        #グループから脱出
        await self.channel_layer.group_discard(
            "tweets",
            self.channel_name
        )

    async def receive(self, text_data):
        #メッセージを全員にブロードキャスト
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            "tweets",
            {
                'type': 'tweet_message',
                'message': message
            }
        )
    
    async def tweet_message(self, event):
        #メッセージをクライアントに送信

        await self.send(text_data=json.dumps({
            'type': event['type'],
            'message': event['message'],
            'tweet': event['tweet'],
        }))