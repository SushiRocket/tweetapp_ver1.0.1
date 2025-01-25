# backend/dm/views.py

from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework import status
from rest_framework.response import Response
from.models import DirectMessage
from.serializers import DirectMessageSerializer
from django.db import models

# Create your views here.

class DirectMessageViewset(viewsets.ModelViewSet):
    queryset = DirectMessage.objects.all().order_by('created_at')
    serializer_class = DirectMessageSerializer
    permission_classes =  [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        #POST時にsenderを自動セット
        serializer.save(sender=self.request.user)

    def get_queryset(self):
        #認証ユーザーが関係するDMのみ表示
        user = self.request.user
        return DirectMessage.objects.filter(
            models.Q(sender=user) | models.Q(recipient=user)
        ).order_by('created_at')