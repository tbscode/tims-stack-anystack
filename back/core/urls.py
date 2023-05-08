from django.urls import path, include, re_path
from .views import index
from .api import (
    register_user
)

urlpatterns = [
    re_path(r'^(?P<path>.*)$', index),
    path("api/register", register_user),
]
