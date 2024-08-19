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
            print("Parametros: ", id, anoi, anof)
            
            tarefas = []
            print('Acumulando unica tarefas...')
            tarefas.append(tarefa_retorna_contagem_de_indprodart_com_listanegra.s(id, anoi, anof, None))
            tarefas.append(tarefa_retorna_contagem_de_qualis_com_listanegra.s(id, anoi, anof, None))
            tarefas.append(tarefa_retorna_contagem_de_qualis_do_lattes.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_contagem_de_qualis_discentes.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_estatisticas_de_artigos.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_estatisticas_de_artigos_ppgs_correlatos.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_contagem_de_indprodart_absoluto.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_indori.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_inddistori.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_indaut.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_inddis.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_partdis.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_indcoautoria.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_indori_medio.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_inddistori_medio.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_indaut_medio.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_inddis_medio.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_partdis_medio.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_indcoautoria_medio.s(id, anoi, anof))
            tarefas.append(tarefa_retorna_tempos_de_conclusao.s(id, anoi, anof))
            # tarefa_retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, None)
            # tarefa_retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, None)
            # tarefa_retorna_contagem_de_qualis_do_lattes(id, anoi, anof)
            # tarefa_retorna_contagem_de_qualis_discentes(id, anoi, anof)
            # tarefa_retorna_estatisticas_de_artigos(id, anoi, anof)
            # tarefa_retorna_estatisticas_de_artigos_ppgs_correlatos(id, anoi, anof)
            # tarefa_retorna_contagem_de_indprodart_absoluto(id, anoi, anof)
            # tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra(id, anoi, anof)
            # tarefa_retorna_indori(id, anoi, anof)
            # tarefa_retorna_inddistori(id, anoi, anof)
            # tarefa_retorna_indaut(id, anoi, anof)
            # tarefa_retorna_inddis(id, anoi, anof)
            # tarefa_retorna_partdis(id, anoi, anof)
            # tarefa_retorna_indcoautoria(id, anoi, anof)
            # tarefa_retorna_indori_medio(id, anoi, anof)
            # tarefa_retorna_inddistori_medio(id, anoi, anof)
            # tarefa_retorna_indaut_medio(id, anoi, anof)
            # tarefa_retorna_inddis_medio(id, anoi, anof)
            # tarefa_retorna_partdis_medio(id, anoi, anof)
            # tarefa_retorna_indcoautoria_medio(id, anoi, anof)
            # tarefa_retorna_tempos_de_conclusao(id, anoi, anof)


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