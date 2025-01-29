from celery import Celery
import os
from backend.core.config import settings

os.environ.setdefault("FORKED_BY_MULTIPROCESSING", "1") #para SO Windows apenas

porta = settings.REDIS_PORT
backend = 'redis://'+settings.LOCAL_REDIS_URL+':'+porta+'/1'
broker = 'amqp://'+settings.RABBITMQ_DEFAULT_USER+':'+ settings.RABBITMQ_DEFAULT_PASS+'@'+settings.RABBITMQ_HOST+':5672/'+settings.RABBITMQ_DEFAULT_VHOST

print("BROKER: " + broker)

BASE_PATH_PPG = "backend/worker/tasks_ppg"
BASE_IMPORT_PATH_PPG = "backend.worker.tasks_ppg"
BASE_PATH_PPGLS = "backend/worker/tasks_ppgls"
BASE_IMPORT_PATH_PPGLS = "backend.worker.tasks_ppgls"
BASE_PATH_GRAD = "backend/worker/tasks_grad"
BASE_IMPORT_PATH_GRAD = "backend.worker.tasks_grad"
BASE_PATH_LOGIN = "backend/worker"
BASE_IMPORT_PATH_LOGIN = "backend.worker"

# Encontra todos os arquivos Python no diretório BASE_PATH
def list_task_modules(base_path, base_import_path):
    task_modules = []
    for root, _, files in os.walk(base_path):
        for file in files:
            if file.endswith(".py") and file != "__init__.py":
                relative_path = os.path.relpath(os.path.join(root, file), base_path)
                module_name = relative_path.replace(os.sep, ".").removesuffix(".py")
                full_import_path = f"{base_import_path}.{module_name}"
                task_modules.append(full_import_path)
    return task_modules

task_modules = list_task_modules(BASE_PATH_PPG, BASE_IMPORT_PATH_PPG)
task_modules.extend(list_task_modules(BASE_PATH_PPGLS, BASE_IMPORT_PATH_PPGLS))
task_modules.extend(list_task_modules(BASE_PATH_GRAD, BASE_IMPORT_PATH_GRAD))
task_modules.extend(list_task_modules(BASE_PATH_LOGIN, BASE_IMPORT_PATH_LOGIN))

app_celery_queries = Celery('queries', broker=broker, backend=backend, include=task_modules)

app_celery_queries.conf.update(
    task_routes={
        f'{BASE_IMPORT_PATH_PPG}.*': {'queue': 'fila_queries'},
        f'{BASE_IMPORT_PATH_PPGLS}.*': {'queue': 'fila_queries'},
        f'{BASE_IMPORT_PATH_GRAD}.*': {'queue': 'fila_queries'}
    },
    worker_prefetch_multiplier=1,
)

app_celery_queries.conf.broker_connection_retry_on_startup = True

response = app_celery_queries.control.enable_events(reply = True)
print("Response: ", response)
