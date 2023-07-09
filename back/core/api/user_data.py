from rest_framework_dataclasses.serializers import DataclassSerializer
from rest_framework.request import Request
from typing import Literal, Optional, List, Dict
from datetime import datetime
from drf_spectacular.utils import extend_schema, inline_serializer
from dataclasses import dataclass
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth import authenticate, login
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async, async_to_sync
from core.models import UserProfileSerializer
from core import api


from rest_framework.decorators import api_view
from rest_framework.response import Response

# Custom debug function
def debug_request(request):
    print("----- DEBUG REQUEST -----")
    print("Method: ", request.method)
    print("Path: ", request.path)

    print("Headers:")
    for header, value in request.META.items():
        if header.startswith('HTTP_'):
            print(f"{header[5:].title().replace('_', '-')}: {value}")

    if request.data:
        print("Data: ", request.data)

    print("Query Params: ", request.query_params)
    print("--------------------------")

def get_user_data(user, request):
    """
    All the relevant user data for one user 
    TODO paginate everything!
    """
    chats_paginated = api.ChatsModelViewSet.emulate(request).list()
    chats = chats_paginated["results"]
    
    message_viewset = api.MessagesModelViewSet.emulate(request)
    messages = {chat['uuid']: message_viewset.list(chat_uuid=chat['uuid']) for chat in chats} 

    #message_viewset = MessagesModelViewSet()
    #message_viewset.initialize_request(request)
    
    return {
        "uuid": str(user.uuid),
        "email": user.email,
        "is_staff": user.is_staff,
        "chats": chats_paginated,
        "messages": messages,
        "profile": UserProfileSerializer(user.profile).data,
    }

@api_view(['GET'])
@extend_schema(
    auth=["SessionAuthentication"],
    request=inline_serializer(name="GetUserData", fields={})
)
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def request_user_data(request):

    response = Response(get_user_data(request.user, request), status=status.HTTP_200_OK, content_type="application/json")
    return response
