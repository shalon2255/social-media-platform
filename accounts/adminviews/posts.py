from rest_framework import viewsets
from rest_framework.response import Response
from posts.models import Post
from accounts.permissions import IsAdminUser

class AdminPostViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    def list(self, request):
        posts = Post.objects.all().order_by("-created_at")

        return Response([
            {
                "id": post.id,
                "caption": post.caption,
                "user": post.user.username,
                "created_at": post.created_at
            }
            for post in posts
        ])
