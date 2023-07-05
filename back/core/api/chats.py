from rest_framework import serializers, viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from core.models import Chat, ChatSerializer
from rest_framework.pagination import PageNumberPagination
from core.api.viewsets import UserStaffRestricedModelViewsetMixin


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 10


class ChatsModelViewSet(viewsets.ModelViewSet, UserStaffRestricedModelViewsetMixin):
    """
    Simple Viewset for modifying user profiles
    """
    allow_user_list = True
    not_user_editable = ChatSerializer.Meta.fields # For users all fields are ready only on this one!
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    queryset = Chat.objects.all()

    def get_queryset(self):
        if not self.request.user.is_staff:
            return Chat.get_chats(self.request.user)
        else:
            return self.queryset