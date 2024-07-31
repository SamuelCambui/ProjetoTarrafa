from __future__ import print_function
import sys
from pathlib import Path
from celery import group
from google.protobuf.json_format import Parse, MessageToJson, ParseDict

from backend.worker.queries import *
from backend.db.cache import cache_grpc
from protos.out import ppg_pb2, ppg_pb2_grpc, messages_pb2


# Implementação do serviço gRPC
class Indicadores(ppg_pb2_grpc.IndicadoresServicer):
    @cache_grpc
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
            ret_values = result.get()
            print('Coletando resultados das tarefas...')
            
            ppg_response = messages_pb2.PpgResponse()
            for result in ret_values:
                ppg_json = ParseDict(result, messages_pb2.PpgJson())
                ppg_response.item.append(ppg_json)

            print('Retornando resultados.')

            return ppg_response
        except Exception as e:
            print(e)
            return None