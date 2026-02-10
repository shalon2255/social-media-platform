from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from accounts.models import ActivityLog
from accounts.serializers import ActivityLogSerializer

class AdminActivityView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        logs = ActivityLog.objects.all().order_by("-created_at")[:100]
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)
