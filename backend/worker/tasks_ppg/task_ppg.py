import json
from google.protobuf.json_format import MessageToDict

from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_retorna_informacao_ppg(id_ppg : str):
    try:
        respostaDict = crud.queries_ppg.retorna_informacao_ppg(id_ppg)
        retorno = messages_pb2.PpgJson(nome='informacaoPpg', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='informacaoPpg', json=None))

@app_celery_queries.task
def tarefa_retorna_anos_ppg(id_ppg : str):
    try:
        respostaDict = crud.queries_ppg.retorna_anos(id_ppg)
        retorno = messages_pb2.PpgJson(nome='anosPpg', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='anosPpg', json=None))

def agrupar_tarefas_ppg(id_ppg : str):
    tarefas = []
    print('Acumulando unica tarefas PPG...')
    tarefas.append(tarefa_retorna_informacao_ppg.s(id_ppg))
    tarefas.append(tarefa_retorna_anos_ppg.s(id_ppg))
    return tarefas