from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet

# CORRECT IMPORT
from accounts.adminviews.posts import AdminPostViewSet

router = DefaultRouter()

router.register(r"", PostViewSet, basename="posts")
router.register("comments", CommentViewSet, basename="comments")

router.register("admin/posts", AdminPostViewSet, basename="admin-posts")

urlpatterns = [
    path("", include(router.urls)),
]
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)