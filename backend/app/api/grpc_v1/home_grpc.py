from __future__ import print_function
from celery import group
from google.protobuf.json_format import ParseDict

from backend.worker.tasks_ppg import task_home
from backend.db.cache import cache_grpc
from protos.out import ppg_pb2_grpc, messages_pb2


# Implementação do serviço gRPC
class Home(ppg_pb2_grpc.HomeServicer):
    # @cache_grpc
    def ObtemHome(self, request, context):
        print('ObtemHome chamada...')
        try:
            id = request.id
            print("Parametros: ", id)
            
            tarefas = task_home.agrupar_tarefas_home(id)

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