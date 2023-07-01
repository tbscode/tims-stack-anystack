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


urlpatterns = [
    path("api/register", api.register.register_user),
    path("api/user_data", api.user_data.request_user_data),
    path("api/login", api.login.login_user),
    path("api/profile/", profile_api_user),
    path("api/profiles/", profile_api_admin_list),
    path("api/profiles/<int:pk>/", profile_api_admin),
    re_path(r'^(?P<path>.*)$', index),
]
