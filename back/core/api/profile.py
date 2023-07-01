from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from core.models import UserProfile, UserProfileSerializer

class UpdateProfileViewset(viewsets.ModelViewSet):
    """
    Simple Viewset for modifying user profiles
    """
    serializer_class = UserProfileSerializer
    permission_classes = [UserProfile]
    
    def get_object(self):
        if not self.request.user.is_staff:
            self.kwargs["pk"] = self.request.user.id
        else:
            if not "pk" in self.kwargs:
                self.kwargs["pk"] = self.request.user.id
        
        return super().get_object()
    
    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        if not self.request.user.is_staff:
            return UserProfile.objects.filter(user=self.request.user)
        else:
            return UserProfile.objects.all()