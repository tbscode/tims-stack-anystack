from django.conf import settings
import requests
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from core.api.user_data import get_user_data
from django.shortcuts import redirect
from rest_framework.request import Request


@api_view(['GET'])
def index(request, path):
    # TODO: use authentication based redirect instead
    if request.user.is_authenticated:
        return render_nextjs_page(get_user_data(request.user, request), path=path)
    else:
        return render_nextjs_page({"redirect": "/login"}, path=path)


def render_nextjs_page(data, path=""):
    url = settings.NEXTJS_HOST_URL
    url = f"{url}/{path}"
    print(f"TBS Routing to {url}")
    resp = requests.post(url, json=data)
    return HttpResponse(resp.text)
