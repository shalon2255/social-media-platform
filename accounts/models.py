
from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

# Create your models here.
class Follow(models.Model):
    follower = models.ForeignKey(
        User, related_name="following_set", on_delete=models.CASCADE
    )
    following = models.ForeignKey(
        User, related_name="followers_set", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ("follower", "following")

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower} follows {self.following}"
    

class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.user.username    
    
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ActivityLog(models.Model):
    ACTION_TYPES = [
        ("login", "Login"),
        ("logout", "Logout"),
        ("post", "Created Post"),
        ("comment", "Commented"),
        ("like", "Liked Post"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    message = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action}"