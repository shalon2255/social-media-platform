from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers 
from .views import PostViewSet, CommentViewSet
from accounts.adminviews.posts import AdminPostViewSet

# Parent router for posts
router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="posts")
router.register("admin/posts", AdminPostViewSet, basename="admin-posts")

# ✅ Nested router for comments under posts
posts_router = routers.NestedDefaultRouter(router, "posts", lookup="post")
posts_router.register("comments", CommentViewSet, basename="post-comments")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(posts_router.urls)), 
]

from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)