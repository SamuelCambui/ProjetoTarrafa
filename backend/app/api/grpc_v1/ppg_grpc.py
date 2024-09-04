from __future__ import print_function
import sys
from pathlib import Path
from celery import group
from google.protobuf.json_format import Parse, MessageToJson, ParseDict

from backend.worker.tasks_ppg import task_indicadores, task_bancas, task_docentes, task_egressos, task_projetos
from backend.db.cache import cache_grpc
from protos.out import ppg_pb2, ppg_pb2_grpc, messages_pb2


# Implementação do serviço gRPC
class PPG(ppg_pb2_grpc.PPGServicer):
    @cache_grpc
    def ObtemIndicadores(self, request, context):
        print('ObtemIndicadores chamada...')
        try:
            id = request.id
            anoi = request.anoi
            anof = request.anof
            print("Parametros: ", id, anoi, anof)
            
            tarefas = task_indicadores.agrupar_tarefas_indicadores(id, anoi, anof)

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
    
    @cache_grpc
    def ObtemBancas(self, request, context):
        print('ObtemBancas chamada...')
        try:
            id = request.id
            anoi = request.anoi
            anof = request.anof
            print("Parametros: ", id, anoi, anof)
            
            tarefas = task_bancas.agrupar_tarefas_bancas(id, anoi, anof)

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
        
    @cache_grpc
    def ObtemDocentes(self, request, context):
        print('ObtemDocentes chamada...')
        try:
            id = request.id
            anoi = request.anoi
            anof = request.anof
            print("Parametros: ", id, anoi, anof)
            
            tarefas = task_docentes.agrupar_tarefas_docentes(id, anoi, anof)

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
        
    @cache_grpc
    def ObtemEgressos(self, request, context):
        print('ObtemEgressos chamada...')
        try:
            id = request.id
            anoi = request.anoi
            anof = request.anof
            print("Parametros: ", id, anoi, anof)
            
            tarefas = task_egressos.agrupar_tarefas_egressos(id, anoi, anof)

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
    
    @cache_grpc
    def ObtemProjetos(self, request, context):
        print('ObtemProjetos chamada...')
        try:
            id = request.id
            anoi = request.anoi
            anof = request.anof
            print("Parametros: ", id, anoi, anof)
            
            tarefas = task_projetos.agrupar_tarefas_projetos(id, anoi, anof)

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