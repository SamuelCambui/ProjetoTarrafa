import json
from google.protobuf.json_format import MessageToDict

from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_retorna_informacao_ppg(id_ppg):
    try:
        respostaDict = crud.queries_ppg.retorna_informacao_ppg(id_ppg)
        print("RespostaDICT", respostaDict)
        retorno = messages_pb2.PpgJson(nome='informacao_ppg', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        print("ERROR")
        return MessageToDict(messages_pb2.PpgJson(nome='informacao_ppg', json=None))
def agrupar_tarefas_ppg(id_ppg):
    tarefas = []
    print('Acumulando unica tarefas PPG...')
    tarefas.append(tarefa_retorna_informacao_ppg.s(id_ppg))
    return tarefas