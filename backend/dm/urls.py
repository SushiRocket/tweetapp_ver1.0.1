# backend/dm/urls.py

from rest_framework.routers import DefaultRouter
from.views import DirectMessageViewset

router = DefaultRouter()
router.register(r'dm', DirectMessageViewset, basename='dm')

urlpatterns = router.urls