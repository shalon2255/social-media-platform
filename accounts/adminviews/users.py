from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.response import Response
from accounts.permissions import IsAdminUser
from django.shortcuts import get_object_or_404

User = get_user_model()


class AdminUserViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    # LIST ALL USERS
    def list(self, request):
        users = User.objects.all().order_by("-date_joined")

        data = [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
            }
            for user in users
        ]

        return Response(data)

    # GET SINGLE USER
    def retrieve(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
        })

    # DELETE USER
    def destroy(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)

        # prevent admin deleting himself
        if user == request.user:
            return Response(
                {"detail": "You cannot delete yourself"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()

        return Response({"detail": "User deleted"})
