from django.urls import path, include, re_path
from .views import index
from . import api

urlpatterns = [
    path("api/register", api.register.register_user),
    re_path(r'^(?P<path>.*)$', index),
]
