from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermissoions):
    # オブジェクトの所有者だけが編集・削除できるようにするパーミッション

    def has_object_permissions(self, request, view, obj):
        #安全なメソッド(GET, HEAD, OPTIONS)は許可
        if request.method in permissions.SAFE_METHODS:
            return True
        
        #編集・削除はオーナーのみ許可
        return obj.user == request.user