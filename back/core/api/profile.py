from rest_framework import viewsets, status
from rest_framework import serializers
from rest_framework import response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from core.models import UserProfile, UserProfileSerializer

NOT_USER_EDITABLE = ["last_updated"]

def check_unallowed_args(kwargs):
    res = []
    for item in NOT_USER_EDITABLE:
        if item in kwargs:
            res.append(item)
    return res

class UpdateProfileViewset(viewsets.ModelViewSet):
    """
    Simple Viewset for modifying user profiles
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        if not self.request.user.is_staff:
            self.kwargs["pk"] = self.request.user.id
        else:
            if not "pk" in self.kwargs:
                self.kwargs["pk"] = self.request.user.id
        
        return super().get_object()
    
    def update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            unallowed_args = check_unallowed_args(request.data)
            return response.Response({arg: "Not User editable" for arg in unallowed_args},status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)
    
    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        if not self.request.user.is_staff:
            return UserProfile.objects.filter(user=self.request.user)
        else:
            return UserProfile.objects.all()