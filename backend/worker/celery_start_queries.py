from celery import Celery

from backend.core.config import settings

#os.environ.setdefault("FORKED_BY_MULTIPROCESSING", "1") #para SO Windows apenas
broker = 'redis://'+settings.LOCAL_REDIS_URL
porta = settings.REDIS_PORT
#app_celery = Celery('tasks', broker=broker+':'+porta+'/1',  backend=broker+':'+porta+'/1')

app_celery_queries = Celery('queries',
               broker='amqp://'+settings.RABBITMQ_DEFAULT_USER+':'+ settings.RABBITMQ_DEFAULT_PASS+'@'+settings.RABBITMQ_HOST+':5672/'+settings.RABBITMQ_DEFAULT_VHOST,
               #broker=broker+':'+porta+'/1',  
               backend=broker+':'+porta+'/1',
               include=['backend.worker.queries'])

app_celery_queries.conf.update(
    task_routes={
        'backend.worker.queries.*': {'queue': 'fila_queries'}
    },
    worker_prefetch_multiplier=1,
)

app_celery_queries.conf.broker_connection_retry_on_startup = True