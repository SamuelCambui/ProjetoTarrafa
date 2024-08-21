import json
from google.protobuf.json_format import MessageToDict

from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_retorna_dados_de_tccs_por_linhas_de_pesquisa(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_de_tccs_por_linhas_de_pesquisa(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='dadosdetccsporlinhasdepesquisa', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_dados_de_produtos_por_tcc(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_de_produtos_por_tcc(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='dadosdeprodutosportcc', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_levantemento_externos_em_bancas(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_levantemento_externos_em_bancas(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='levantamentoexternosembancas', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
def agrupar_tarefas_bancas(id, anoi, anof):
    tarefas = []
    print('Acumulando unica tarefas bancas...')
    tarefas.append(tarefa_retorna_dados_de_tccs_por_linhas_de_pesquisa.s(id, anoi, anof, None))
    tarefas.append(tarefa_retorna_dados_de_produtos_por_tcc.s(id, anoi, anof, None))
    tarefas.append(tarefa_retorna_levantemento_externos_em_bancas.s(id, anoi, anof))
    return tarefas