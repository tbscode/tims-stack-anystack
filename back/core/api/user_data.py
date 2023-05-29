from rest_framework_dataclasses.serializers import DataclassSerializer
from typing import Literal, Optional, List, Dict
from datetime import datetime
from drf_spectacular.utils import extend_schema
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

def get_user_data(user):
    """
    All the relevant user data for one user 
    TODO paginate everything!
    """

    return {
        "uuid": str(user.uuid),
        "email": user.email,
        "profile_image": user.profile.image,
        "first_name": user.profile.first_name,
    }


@extend_schema(
    auth=["SessionAuthentication"],
)
@api_view(['GET', 'POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def request_user_data(request):

    response = Response(get_user_data(request.user), status=status.HTTP_200_OK, content_type="application/json")
    return response
