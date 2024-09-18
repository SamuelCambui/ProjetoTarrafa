from celery import Celery

import os
from backend.core.config import settings

os.environ.setdefault("FORKED_BY_MULTIPROCESSING", "1") #para SO Windows apenas

porta = settings.REDIS_PORT
backend = 'redis://'+settings.LOCAL_REDIS_URL+':'+porta+'/1'
broker = 'amqp://'+settings.RABBITMQ_DEFAULT_USER+':'+ settings.RABBITMQ_DEFAULT_PASS+'@'+settings.RABBITMQ_HOST+':5672/'+settings.RABBITMQ_DEFAULT_VHOST

app_celery_queries = Celery('queries',
               broker=broker,
               backend=backend,
               include=['backend.worker.queries', 'backend.worker.tasks_ppgls.tasks_cursos_ppgls', 'backend.worker.tasks_ppgls.tasks_disciplinas_ppgls', 
                        'backend.worker.tasks_ppgls.tasks_formulario_ppgls'])

app_celery_queries.conf.update(
    task_routes={
        'backend.worker.queries.*': {'queue': 'fila_queries'},
        'backend.worker.tasks_ppgls.tasks_cursos_ppgls.*': {'queue': 'fila_queries'},
        'backend.worker.tasks_ppgls.tasks_disciplinas_ppgls.*': {'queue': 'fila_queries'},
        'backend.worker.tasks_ppgls.tasks_formulario_ppgls.*': {'queue': 'fila_queries'},

    },
    worker_prefetch_multiplier=1,
)

app_celery_queries.conf.broker_connection_retry_on_startup = True