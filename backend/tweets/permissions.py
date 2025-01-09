#backend/tweets/permissions.py

from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    # オブジェクトの所有者だけが編集・削除できるようにするパーミッション

    def has_object_permission(self, request, view, obj):
        #安全なメソッド(GET, HEAD, OPTIONS)は許可
        if request.method in permissions.SAFE_METHODS:
            return True
        
        #編集・削除はオーナーのみ許可
        return obj.user == request.user