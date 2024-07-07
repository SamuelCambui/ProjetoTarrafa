from __future__ import print_function

import json

import sys
from pathlib import Path


# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))

from celery import group
from backend.worker.queries import *

from proto.out import ppg_pb2, ppg_pb2_grpc, messages_pb2
from google.protobuf.json_format import Parse, MessageToJson


# Implementação do serviço gRPC
class Indicadores(ppg_pb2_grpc.IndicadoresServicer):
    def ObtemIndicadores(self, request, context):
        print('ObtemIndicadores chamada...')
        try:
            id = request.id
            anoi = request.anoi
            anof = request.anof
            
            tarefas = []
            print('Acumulando unica tarefas...')
            tarefas.append(tarefa_retorna_contagem_de_indprodart_com_listanegra.s(id, anoi, anof, None))
            tarefas.append(tarefa_retorna_contagem_de_qualis_com_listanegra.s(id, anoi, anof, None))

            print('Agrupando e disparando tarefas...')
            
            job = group(tarefas)
            result = job.apply_async()
            start_time = time.time()
            ret_values = result.get()
            print('Coletando resultados das tarefas...')
            end_time = time.time()  # Tempo final
            print(f"Tempo de execução  ret: {end_time - start_time} segundos")
            
            ppg_response = messages_pb2.PpgResponse()
            for result in ret_values:
                ppg_json = ParseDict(result, messages_pb2.PpgJson())
                ppg_response.item.append(ppg_json)

            print('Retornando resultados.')

            return ppg_response
        except Exception as e:
            print(e)
            return None