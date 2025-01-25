# backend/channels_jwt_middleware.py

import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser,User
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from urllib.parse import parse_qs


from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import UntypedToken

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()
    
class JWTAuthMiddleware(BaseMiddleware):
    #Websocket接続時にクエリパラメータ(?token=xxxx)を読み取り
    #JWTを検証してscope['user']に設定する

    async def __call__(self, scope, receive, send):
        query_string = scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token_list = query_params.get('token', None)

        if token_list:
            token = token_list[0]
            print(f"[JWTAutMiddleware] Token found: {token}")
            try:
                UntypedToken(token) # トークンの正当性を検証
                payload = jwt.decode( # デコードしてペイロード取得
                    token,
                    settings.SECRET_KEY,
                    algorithms=["HS256"]
                )
                print(f"[JWTAuthMiddleware] Decoded payload: {payload}")
                user_id = payload.get('user_id')
                if user_id is not None:
                    user = await get_user(user_id)
                    print(f"[JWTAuthMiddleware] User retrieved: {user}")
                    scope['user'] = user
                else:
                    print("[JWTAuthMiddleware] user_id not found in payload")
                    scope['user'] = AnonymousUser()
            except (InvalidToken, jwt.DecodeError, jwt.ExpiredSignatureError):
                scope['user'] = AnonymousUser()

        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)