from os import getenv

# Network bindings
bind = [
    f"[::]:{getenv('PORT', '8000')}"
]

# AsyncIO specifics
workers = int(getenv('WORKERS', 2))
worker_class = 'uvicorn.workers.UvicornWorker'
worker_timeout = int(getenv('WORKER_TIMEOUT', 120))
graceful_timeout = int(getenv('GRACEFUL_TIMEOUT', 120))

# Logging
acccesslog = "-"
errorlog = "-"
loglevel = "debug"

# GUNICORN specifics
preload_app = True
daemon = False


