from django.urls import path, include, re_path
from .views import index
from . import api

urlpatterns = [
    path("api/register", api.register.register_user),
    path("api/user_data", api.user_data.request_user_data),
    path("api/login", api.login.login_user),
    re_path(r'^(?P<path>.*)$', index),
]
