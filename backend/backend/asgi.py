# backend/backend/asgi.py

"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""
import os
import django
print("===== ASGI.PY LOADED =====")
print("Before setdefault: ", os.environ.get("DJANGO_SETTINGS_MODULE"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
print("After setdefault: ", os.environ.get("DJANGO_SETTINGS_MODULE"))

django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import tweets.routing
import dm.routing
from middleware.channels_jwt_middleware import JWTAuthMiddleware

print("ASGI starting... setting DJANGO_SETTINGS_MODULE to backend.settings")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

print("Check => ", os.environ.get("DJANGO_SETTINGS_MODULE"))


application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": JWTAuthMiddleware(
        URLRouter(
            tweets.routing.websocket_urlpatterns +
            dm.routing.websocket_urlpatterns
        )
    ),
})
