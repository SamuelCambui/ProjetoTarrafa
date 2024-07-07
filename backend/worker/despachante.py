import os
from celery import Celery
from celery.result import AsyncResult
from celery import shared_task

import threading

import time

import json

import io
import sys
from pathlib import Path

# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent  # Ajuste conforme a necessidade
sys.path.append(str(diretorio_raiz))
print("Diretório de trabalho atual:", os.getcwd())

# from backend.worker.celery_start_despachante import app_filas
from backend.worker.tasks import baixar_e_inserir, insert, processa_aba

from backend.core.config import settings


import pika
import time

# def despachante():
from backend.db.cache import RedisConnector
from retry import retry


@retry(pika.exceptions.AMQPConnectionError, delay=5, jitter=(1, 3))
def despachante():
    redis = RedisConnector()

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
    print(' [*] Waiting for messages. To exit press CTRL+C')


    def callback_progresso(ch, method, properties, body):
        conteudo = json.loads(body.decode())
        chave = conteudo['chave']
        operacao = conteudo['operacao']
        valor = conteudo['valor']
        print(f" [x] Received {chave}, {operacao}, {valor}")
        if operacao == 'incr':
            ret = redis.incrBy(chave, valor)
            if ret:
                print(f'Chave {chave} incrementada para {ret}')
        elif operacao == 'decr':
            ret = redis.decrBy(chave, valor)
            if ret:
                print(f'Chave {chave} decrementada para {ret}')
        print(" [x] Done")
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def callback_tarefas_curriculos(ch, method, properties, body):
        conteudo = body.decode()
        parametros = json.loads(conteudo)
        print(f" [x] Received {parametros['tarefa']}")

        if 'baixar_curriculos' in parametros['tarefa']:
            baixar_e_inserir.delay(parametros['idl'], parametros['chave'])# args=(parametros['idl'], parametros['chave']))
            print(f"Tarefa baixar_e_inserir disparada")
        elif 'processar_curriculos' in parametros['tarefa']:
            insert.delay(parametros['row'], parametros['id_ies'], parametros['chave'])#kwargs=parametros)# args=(parametros['row'], parametros['id_ies'], parametros['chave']))
            print(f"Tarefa processar_curriculo (inserir) disparada")
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def callback_tarefas_criticas(ch, method, properties, body):
        print(f" [x] Received tarefas_criticas")
        conteudo = body.decode()
        parametros = json.loads(conteudo)
        processa_aba(**parametros)
        print(" [x] Done")
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=settings.FILA_PROGRESSOS, on_message_callback=callback_progresso)
    channel.basic_consume(queue=settings.FILA_TAREFAS_CURRICULOS, on_message_callback=callback_tarefas_curriculos)
    channel.basic_consume(queue=settings.FILA_TAREFAS_CRITICAS, on_message_callback=callback_tarefas_curriculos)

    channel.start_consuming()

despachante()


# @app_filas.task
# def consome_progresso():
#     redis = RedisConnector()
#     print(f'PROGRESSO: Escutando mensagens da fila FILA_PROGRESSOS')
#     while True:
#         mensagem = redis.pop(settings.FILA_PROGRESSOS)
#         if mensagem:
#             _, conteudo = mensagem
#             chave = conteudo['chave']
#             operacao = conteudo['operacao']
#             valor = conteudo['valor']
#             if operacao == 'incr':
#                 redis.incrBy(chave, valor)
#             elif operacao == 'decr':
#                 redis.decrBy(chave, valor)

#             print(f"Chave {chave}: modificada")
#     print(f'PROGRESSO: finalizando escuta na fila FILA_PROGRESSOS')

# @app_filas.task
# def consome_tarefas_curriculos():
#     from backend.worker.tasks import baixar_e_inserir, insert  # importação tardia para evitar a inicialização das tarefas importadas
#     redis = RedisConnector()
#     print(f'TAREFAS: Escutando mensagens da fila FILA_TAREFAS_CURRICULOS')

#     while True:

#         mensagem = redis.pop(settings.FILA_TAREFAS_CURRICULOS)
    
#         if mensagem:
#             _, valor = mensagem
#             parametros = json.loads(valor)

#             if 'baixar_curriculos' in parametros['tarefa']:
#                 baixar_e_inserir.delay(parametros['idl'], parametros['chave'])# args=(parametros['idl'], parametros['chave']))
#                 print(f"Tarefa baixar_e_inserir disparada")
#             elif 'processar_curriculos' in parametros['tarefa']:
#                 insert.delay(parametros['row'], parametros['id_ies'], parametros['chave'])#kwargs=parametros)# args=(parametros['row'], parametros['id_ies'], parametros['chave']))
#                 print(f"Tarefa processar_curriculo (inserir) disparada")
        
#             time.sleep(1)
            
#         else:
#             print('mensagem nula')
#     print(f'PROGRESSO: finalizando escuta na fila FILA_TAREFAS_CURRICULOS')

# @app_filas.task
# def consome_tarefas_criticas():
#     from backend.worker.tasks import processa_aba  # importação tardia para evitar a inicialização das tarefas importadas
#     redis = RedisConnector()
#     print(f'TAREFAS: Escutando mensagens da fila FILA_TAREFAS_CRITICAS')

#     while True:

#         mensagem = redis.pop(settings.FILA_TAREFAS_CRITICAS)
    
#         if mensagem:
#             _, valor = mensagem
#             parametros = json.loads(valor)

#             processa_aba(**parametros)
            
#         else:
#             print('mensagem nula')
#     print(f'PROGRESSO: finalizando escuta na fila FILA_TAREFAS_CRITICAS')






