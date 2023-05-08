from rest_framework_dataclasses.serializers import DataclassSerializer
from typing import Literal, Optional, List, Dict
from datetime import datetime
from drf_spectacular.utils import extend_schema
from dataclasses import dataclass
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status


@dataclass
class Person:
    name: str
    email: str
    password: str
    password_confirm: str
    gender: Literal['male', 'female']


class RegisterSerializer(DataclassSerializer):
    class Meta:
        dataclass = Person


@extend_schema(
    request=RegisterSerializer(many=False),
    auth=None,
)
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    # TODO: yet to be finished
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
