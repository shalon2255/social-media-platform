from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import PostViewSet, CommentViewSet
from accounts.adminviews.posts import AdminPostViewSet

# ✅ Create parent router with empty prefix
router = DefaultRouter()
router.register(r"", PostViewSet, basename="posts")  
router.register(r"admin/posts", AdminPostViewSet, basename="admin-posts")

# ✅ Nested router for comments
posts_router = routers.NestedDefaultRouter(router, "", lookup="post")
posts_router.register(r"comments", CommentViewSet, basename="post-comments")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(posts_router.urls)),
]

from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)