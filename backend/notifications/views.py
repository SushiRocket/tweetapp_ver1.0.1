from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from.models import Notification
from.serializers import NotificationSerializer
from rest_framework.response import Response


# Create your views here.

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user, is_read=False)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        notifications = Notification.objects.filter(recipient=request.user, is_read=False)
        notifications.update(is_read=True)
        return Response({'status': 'Notifications marked as read'})