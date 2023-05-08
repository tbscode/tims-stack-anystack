python3 manage.py migrate

uvicorn conf.asgi:application --reload --port 8000 --host 0.0.0.0