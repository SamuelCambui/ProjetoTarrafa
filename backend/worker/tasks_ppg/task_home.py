import json
from google.protobuf.json_format import MessageToDict
from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_retorna_lista_programas(id_ies):
    try:
        respostaDict = crud.queries_ppg.retorna_lista_programas(id_ies)
        retorno = messages_pb2.PpgJson(nome='listaprogramas', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='listaprogramas', json=None))
@app_celery_queries.task
def tarefa_retorna_dados_home(id_ies):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_home(id_ies)
        retorno = messages_pb2.PpgJson(nome='dadoshome', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='dadoshome', json=None))
    
def agrupar_tarefas_home(id_ies):
    tarefas = []
    print('Acumulando unica tarefas bancas...')
    tarefas.append(tarefa_retorna_lista_programas.s(id_ies))
    tarefas.append(tarefa_retorna_dados_home.s(id_ies))
    return tarefas