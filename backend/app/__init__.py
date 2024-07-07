import pika
from backend.core.config import settings



credentials = pika.PlainCredentials(settings.RABBITMQ_DEFAULT_USER, settings.RABBITMQ_DEFAULT_PASS)
parametros = pika.ConnectionParameters(settings.RABBITMQ_HOST,
                                        5672,
                                        settings.RABBITMQ_DEFAULT_VHOST,
                                        credentials,heartbeat=600,
                                        blocked_connection_timeout=300)

connection = pika.BlockingConnection(parametros)

channel = connection.channel()

channel.queue_declare(queue=settings.FILA_PROGRESSOS, durable=True)
channel.queue_declare(queue=settings.FILA_TAREFAS_CURRICULOS, durable=True)
channel.queue_declare(queue=settings.FILA_TAREFAS_CRITICAS, durable=True)