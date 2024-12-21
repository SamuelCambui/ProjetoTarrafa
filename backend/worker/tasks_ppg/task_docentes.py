import json
from google.protobuf.json_format import MessageToDict
from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_retorna_professores_por_categoria(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_professores_por_categoria(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='professorporcategoria', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='professorporcategoria', json=None))
    
@app_celery_queries.task
def tarefa_retorna_quantidade_de_discentes_titulados(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_quantidade_de_discentes_titulados(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='discentestitulados', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='discentestitulados', json=None))
    
@app_celery_queries.task
def tarefa_retorna_tempo_de_atualizacao_do_lattes(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_tempo_de_atualizacao_do_lattes(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='atualizacaolattes', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='atualizacaolattes', json=None))
    
@app_celery_queries.task
def tarefa_retorna_grafo_de_coautores_do_ppg(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_grafo_de_coautores_do_ppg(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='grafocoautoresdoppg', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='grafocoautoresdoppg', json=None))
    
@app_celery_queries.task
def tarefa_retorna_grafo_de_coautores_do_programa(id_ies, id, anoi, anof, autor):
    try:
        respostaDict = crud.queries_ppg.retorna_grafo_de_coautores_do_programa(id_ies, id, anoi, anof, autor)
        retorno = messages_pb2.PpgJson(nome='grafocoautoresdoprograma', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='grafocoautoresdoprograma', json=None))
    
@app_celery_queries.task
def tarefa_retorna_producoes_do_professor(idlattes, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_producoes_do_professor(idlattes, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='producoesprofessor', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='producoesprofessor', json=None))

def agrupar_tarefas_docentes(id : str, anoi : int, anof : int):
    tarefas = []
    print('Acumulando unica tarefas docentes...')
    tarefas.append(tarefa_retorna_professores_por_categoria.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_quantidade_de_discentes_titulados.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_tempo_de_atualizacao_do_lattes.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_grafo_de_coautores_do_ppg.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_producoes_do_professor.s(id, anoi, anof))
    return tarefas