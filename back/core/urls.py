from django.urls import path, include, re_path
from .views import index
from . import api

profile_api_user = api.UpdateProfileViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})

profile_api_admin = api.UpdateProfileViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})

profile_api_admin_list = api.UpdateProfileViewset.as_view({
    'get': 'list',
})

messages_api_user_list = api.messages.MessagesModelViewSet.as_view({
    'get': 'list',
})

message_api_user = api.messages.MessagesModelViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})

messages_api_user_send = api.messages.MessagesModelViewSet.as_view({
    'post': 'send',
})

messages_api_user_read = api.messages.MessagesModelViewSet.as_view({
    'post': 'read',
})

chat_api_user_list = api.chats.ChatsModelViewSet.as_view({
    'get': 'list',
})


chat_api_user = api.chats.ChatsModelViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})


urlpatterns = [
    path("api/register", api.register.register_user),
    path("api/user_data", api.user_data.request_user_data),
    path("api/login", api.login.login_user),
    path("api/profile/", profile_api_user),

    path("api/chats/", chat_api_user_list),
    path("api/chats/<str:pk>/", chat_api_user),

    path("api/profiles/", profile_api_admin_list),
    path("api/profiles/<str:pk>/", profile_api_admin),

    path("api/messages/", messages_api_user_list),
    path("api/messages/<str:chat_uuid>/send/", messages_api_user_send),
    path("api/messages/<str:chat_uuid>/", messages_api_user_list),
    path("api/messages/<str:pk>/read/", messages_api_user_send),
    path("api/messages/<str:pk>/", message_api_user),

    re_path(r'^(?P<path>.*)$', index),
]
