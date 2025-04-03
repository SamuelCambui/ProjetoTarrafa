import json
from google.protobuf.json_format import MessageToDict
from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2


@app_celery_queries.task
def tarefa_retorna_professores_por_categoria(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_professores_por_categoria(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='professorPorCategoria', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='professorPorCategoria', json=None))
    
@app_celery_queries.task
def tarefa_retorna_quantidade_de_discentes_titulados(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_quantidade_de_discentes_titulados(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='discentesTitulados', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='discentesTitulados', json=None))
    
@app_celery_queries.task
def tarefa_retorna_tempo_de_atualizacao_do_lattes(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_tempo_de_atualizacao_do_lattes(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='atualizacaoLattes', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='atualizacaoLattes', json=None))
    
@app_celery_queries.task
def tarefa_retorna_lista_de_professores_por_ano(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_lista_de_professores_por_ano(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='listaProfessores', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='listaProfessores', json=None))
    
@app_celery_queries.task
def tarefa_retorna_grafo_de_coautores_do_ppg(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_grafo_de_coautores_do_ppg(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='grafoCoautoresdoPpg', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='grafoCoautoresdoPpg', json=None))
    
@app_celery_queries.task
def tarefa_retorna_grafo_de_coautores_do_programa(id_ies : str, id : str, anoi : int, anof : int, autor : str):
    try:
        respostaDict = crud.queries_ppg.retorna_grafo_de_coautores_do_programa(id_ies, id, anoi, anof, autor)
        retorno = messages_pb2.PpgJson(nome='grafoCoautoresdoPrograma', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='grafoCoautoresdoPrograma', json=None))
    
# @app_celery_queries.task
# def tarefa_retorna_producoes_do_professor(idlattes, anoi, anof):
#     try:
#         respostaDict = crud.queries_ppg.retorna_producoes_do_professor(idlattes, anoi, anof)
#         retorno = messages_pb2.PpgJson(nome='producoesProfessor', json=json.dumps(respostaDict))
#         return MessageToDict(retorno)
#     except Exception as e:
#         print(e)
#         return MessageToDict(messages_pb2.PpgJson(nome='producoesProfessor', json=None))

def agrupar_tarefas_docentes(id : str, anoi : int, anof : int):
    tarefas = []
    print('Acumulando unica tarefas docentes...')
    tarefas.append(tarefa_retorna_lista_de_professores_por_ano.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_professores_por_categoria.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_quantidade_de_discentes_titulados.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_tempo_de_atualizacao_do_lattes.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_grafo_de_coautores_do_ppg.s(id, anoi, anof))
    # tarefas.append(tarefa_retorna_producoes_do_professor.s(id, anoi, anof))
    return tarefas