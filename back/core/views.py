from django.conf import settings
import requests
from django.http import HttpResponse


def index(request, path):
    return render_nextjs_page({"test": "test"}, path="/")


def render_nextjs_page(data, path=""):
    url = settings.NEXTJS_HOST_URL + path
    resp = requests.post(url, json=data)
    return HttpResponse(resp.text)
