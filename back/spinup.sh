python3 manage.py migrate

if [ $PRODUCTION -eq 1 ]; then
    python3 manage.py shell --command 'from core.tools import get_or_create_base_admin; get_or_create_base_admin()'
    python3 manage.py shell --command 'from core.tools import get_or_create_test_users; get_or_create_test_users()'
fi

SINGLE_BEAT_REDIS_SERVER="redis://redis-db-svc.tims-stack-dev.svc.cluster.local:6379" single-beat celery -A back beat --loglevel=info &
uvicorn conf.asgi:application --reload --port 8000 --host 0.0.0.0
