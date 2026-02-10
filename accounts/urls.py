from django.urls import path
from .views import RegisterView,FollowUnfollowView, FollowersListView, FollowingListView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserDetailView,IsFollowingView,MeView,EditProfileView,UserSearchView
from rest_framework.routers import DefaultRouter
from accounts.adminviews.users import AdminUserViewSet

from .views import LoginView
from .views import AdminStatsView
from accounts.adminviews.activity import AdminActivityView

router = DefaultRouter()

router.register("admin/users", AdminUserViewSet, basename="admin-users")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('follow/<int:user_id>/', FollowUnfollowView.as_view()),
    path('followers/<int:user_id>/', FollowersListView.as_view()),
    path('following/<int:user_id>/', FollowingListView.as_view()),
    path("admin/activity/", AdminActivityView.as_view()),
    path("is-following/<int:user_id>/", IsFollowingView.as_view()),
    path("users/<int:pk>/", UserDetailView.as_view()),
   path("me/", MeView.as_view()),
   path("profile/edit/", EditProfileView.as_view()),
   path("search/", UserSearchView.as_view(), name="user-search"),
    path("login/", LoginView.as_view(), name="login"),
    path("admin/stats/", AdminStatsView.as_view()),
]
urlpatterns += router.urls
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)