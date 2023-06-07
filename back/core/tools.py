from core.models import User
import json
from django.conf import settings
from random import randint


def get_or_create_base_admin():
    user = User.objects.filter(username=settings.BASE_ADMIN_USERNAME)
    if not user.exists():
        user = User.objects.create_superuser(
            username=settings.BASE_ADMIN_USERNAME,
            password=settings.BASE_ADMIN_USER_PASSWORD
        )
    return user


def _get_or_create_test_users(name):
    user = User.objects.filter(username=name)
    if not user.exists():
        user = User.objects.create_superuser(
            username=name,
            password="Test123!"
        )
    return user

def get_or_create_test_users():
    users = ["testUser1", "testUser2"]
    out = []
    for user in users:
        u = _get_or_create_test_users(user)
        out.append(u)
    return out

