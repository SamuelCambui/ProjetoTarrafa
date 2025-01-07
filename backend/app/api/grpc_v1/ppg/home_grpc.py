from google.protobuf.json_format import ParseDict
from backend.worker.tasks_ppg import task_home
from backend.db.cache import cache_grpc_ppg_home
from protos.out import ppg_pb2_grpc, messages_pb2


# Implementação do serviço gRPC
class Home(ppg_pb2_grpc.HomeServicer):
    @cache_grpc_ppg_home()
    def ObtemProgramas(self, request, context):
        print('ObtemProgramas chamada...')
        try:
            id_ies = request.id_ies
            print("Parametros: ", id_ies)
            
            result = task_home.tarefa_retorna_lista_programas.delay(id_ies).get()
            
            ppg_json = ParseDict(result, messages_pb2.HomeResponse())

            print('Retornando resultados.')

            return ppg_json
        except Exception as e:
            print(e)
            return None
        
    @cache_grpc_ppg_home()
    def ObtemRedeColaboracao(self, request, context):
        print('ObtemRedeColaboracao chamada...')
        try:
            
            id_ies = request.id_ies
            produto = request.produto
            fonte = request.fonte
            anoi = request.anoi
            anof = request.anof
            
            print("Parametros: ", id_ies, produto, fonte, anoi, anof)
            
            result = task_home.tarefa_retorna_grafo_de_coautores_por_subtipo.delay(id_ies, produto, fonte, anoi, anof).get()

            ppg_json = ParseDict(result, messages_pb2.HomeResponse())

            print('Retornando resultados.')

            return ppg_json
        except Exception as e:
            print(e)
            return None
        
    @cache_grpc_ppg_home()
    def ObtemRankingDocentes(self, request, context):
        print('ObtemRankingDocentes chamada...')
        try:
            id_ies = request.id_ies
            print("Parametros: ", id_ies)
            
            result = task_home.tarefa_retorna_ranking_docentes.delay(id_ies).get()
            
            ppg_json = ParseDict(result, messages_pb2.HomeResponse())

            print('Retornando resultados.')

            return ppg_json
        except Exception as e:
            print(e)
            return None
        
    @cache_grpc_ppg_home()
    def ObtemArtigosDocentes(self, request, context):
        print('ObtemArtigosDocentes chamada...')
        try:
            id_ies = request.id_ies
            ano = request.anoi
            print("Parametros: ", id_ies)
            
            result = task_home.tarefa_retorna_lista_de_artigos_da_universidade.delay(id_ies, ano).get()

            print('Agrupando e disparando tarefas...')
            
            ppg_json = ParseDict(result, messages_pb2.HomeResponse())

            print('Retornando resultados.')

            return ppg_json
        except Exception as e:
            print(e)
            return None