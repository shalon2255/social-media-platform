from rest_framework import serializers
from .models import Post,Comment


class PostSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    is_owner = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%d %b %Y, %I:%M %p", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "user_username",
            "caption",
            "image",
            "created_at",
            "is_owner",
            "likes",
            "is_liked",
            "comments",
        ]
        read_only_fields = ["user", "created_at"]

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request and request.user == obj.user

    def get_likes(self, obj):
        return obj.likes.count()   # ✅ FIXED

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return obj.likes.filter(user=request.user).exists()  # ✅ FIXED

    def get_comments(self, obj):
        return obj.comments_set.count()
    
    
    
    
class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "user_username",
            "text",
            "created_at",
        ]
        read_only_fields = ["user", "created_at"]    