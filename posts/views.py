from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Post
from .serializers import PostSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
# Create your views here.
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets
class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
from accounts.models import ActivityLog
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Like
from .serializers import PostSerializer


from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Comment
from .serializers import CommentSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Post
from .serializers import PostSerializer, CommentSerializer
from accounts.models import Follow


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Post.objects.all().order_by("-created_at")

        if self.request.query_params.get("mine") == "1":
            return queryset.filter(user=self.request.user)

        user_id = self.request.query_params.get("user")
        if user_id:
            return queryset.filter(user_id=user_id)

        if self.request.query_params.get("following") == "1":
            following_ids = Follow.objects.filter(
                follower=self.request.user
            ).values_list("following_id", flat=True)

            return queryset.filter(user_id__in=following_ids)

        return queryset
    
    def get_serializer_context(self):
        return {"request": self.request}

    # =========================
    # POST CREATE + LOG
    # =========================
    def perform_create(self, serializer):
        post = serializer.save(user=self.request.user)

        # 🔥 ACTIVITY LOG
        ActivityLog.objects.create(
            user=self.request.user,
            action="Created a new post"
        )

    # =========================
    # COMMENTS + LOG
    # =========================
    @action(
        detail=True,
        methods=["get", "post"],
        permission_classes=[IsAuthenticated],
    )
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == "GET":
            comments = post.comments_set.all().order_by("-created_at")
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, post=post)

        # 🔥 ACTIVITY LOG
        ActivityLog.objects.create(
            user=request.user,
            action=f"Commented on post #{post.id}"
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # =========================
    # LIKE / UNLIKE + LOG
    # =========================
    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAuthenticated],
    )
    def like(self, request, pk=None):
        post = self.get_object()

        like, created = Like.objects.get_or_create(
            user=request.user,
            post=post
        )

        if not created:
            like.delete()

            # 🔥 LOG UNLIKE
            ActivityLog.objects.create(
                user=request.user,
                action=f"Unliked post #{post.id}"
            )

            return Response({"liked": False})

        # 🔥 LOG LIKE
        ActivityLog.objects.create(
            user=request.user,
            action=f"Liked post #{post.id}"
        )

        return Response({"liked": True})

    # =========================
    # SAVE / UNSAVE + LOG
    # =========================
    @action(detail=True, methods=["post"])
    def save(self, request, pk=None):
        post = self.get_object()

        saved, created = SavedPost.objects.get_or_create(
            user=request.user,
            post=post
        )

        if not created:
            saved.delete()

            # 🔥 LOG UNSAVE
            ActivityLog.objects.create(
                user=request.user,
                action=f"Unsaved post #{post.id}"
            )

            return Response({"saved": False})

        # 🔥 LOG SAVE
        ActivityLog.objects.create(
            user=request.user,
            action=f"Saved post #{post.id}"
        )

        return Response({"saved": True})

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_pk = self.kwargs.get("post_pk")  # ✅ Use post_pk
        return Comment.objects.filter(post_id=post_pk)

    def perform_create(self, serializer):
        post_pk = self.kwargs.get("post_pk")  # ✅ Use post_pk
        post = get_object_or_404(Post, id=post_pk)
        serializer.save(user=self.request.user, post=post)

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            return Response(
                {"detail": "You cannot edit this comment"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            return Response(
                {"detail": "You cannot delete this comment"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)