import json
from google.protobuf.json_format import MessageToDict

from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2


@app_celery_queries.task
def tarefa_retorna_dados_de_projetos(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_de_projetos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='dadosdeprojetos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='dadosdeprojetos', json=None))
    
@app_celery_queries.task
def tarefa_retorna_dados_de_linhas_de_pesquisa(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_de_linhas_de_pesquisa(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='dadosdelinhasdepesquisa', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='dadosdelinhasdepesquisa', json=None))
    
@app_celery_queries.task
def tarefa_retorna_dados_de_projetos_e_linhas_de_pesquisa(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_de_projetos_e_linhas_de_pesquisa(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='dadosdeprojetoselinhasdepesquisa', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='dadosdeprojetoselinhasdepesquisa', json=None))
    
def agrupar_tarefas_projetos(id : str, anoi : int, anof : int):
    tarefas = []
    print('Acumulando unica tarefas projetos...')
    tarefas.append(tarefa_retorna_dados_de_projetos.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_dados_de_linhas_de_pesquisa.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_dados_de_projetos_e_linhas_de_pesquisa.s(id, anoi, anof))
    return tarefas