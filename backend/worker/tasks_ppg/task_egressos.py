import json
from google.protobuf.json_format import MessageToDict
from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_retorna_dados_egressos(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_egressos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='dadosEgressos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='dadosEgressos', json=None))
    
@app_celery_queries.task
def tarefa_retorna_tempo_de_atualizacao_do_lattes_egressos(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_tempo_de_atualizacao_do_lattes_egressos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='tempoAtualizacaoLattesEgressos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='tempoAtualizacaoLattesEgressos', json=None))
    
@app_celery_queries.task
def tarefa_retorna_quantidade_egressos_titulados_por_ano(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_quantidade_egressos_titulados_por_ano(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='egressosTituladosPorAno', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='egressosTituladosPorAno', json=None))
    
@app_celery_queries.task
def tarefa_retorna_producoes_egresso(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_producoes_egresso(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='producoesEgressos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='producoesEgressos', json=None))
    
# @app_celery_queries.task
# def tarefa_retorna_resumo_lattes(id : str, anoi : int, anof : int):
#     try:
#         respostaDict = crud.queries_ppg.retorna_resumo_lattes(id, anoi, anof)
#         retorno = messages_pb2.PpgJson(nome='levantamentoexternosembancas', json=json.dumps(respostaDict))
#         return MessageToDict(retorno)
#     except Exception as e:
#         print(e)
#         return MessageToDict(messages_pb2.PpgJson(nome='levantamentoexternosembancas', json=None))
    
def agrupar_tarefas_egressos(id : str, anoi : int, anof : int):
    tarefas = []
    print('Acumulando unica tarefas egressos...')
    tarefas.append(tarefa_retorna_dados_egressos.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_tempo_de_atualizacao_do_lattes_egressos.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_quantidade_egressos_titulados_por_ano.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_producoes_egresso.s(id, anoi, anof))
    return tarefas