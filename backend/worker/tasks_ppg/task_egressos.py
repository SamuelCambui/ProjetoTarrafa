import json
from google.protobuf.json_format import MessageToDict
from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_retorna_dados_egressos(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_egressos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='dadosegressos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='dadosegressos', json=None))
    
@app_celery_queries.task
def tarefa_retorna_tempo_de_atualizacao_do_lattes_egressos(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_tempo_de_atualizacao_do_lattes_egressos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='tempoatualizacaolattesegressos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='tempoatualizacaolattesegressos', json=None))
    
@app_celery_queries.task
def tarefa_retorna_quantidade_egressos_titulados_por_ano(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_quantidade_egressos_titulados_por_ano(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='egressostituladosporano', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='egressostituladosporano', json=None))
    
@app_celery_queries.task
def tarefa_retorna_producoes_egresso(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_producoes_egresso(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='producoesegressos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='producoesegressos', json=None))
    
@app_celery_queries.task
def tarefa_retorna_resumo_lattes(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_resumo_lattes(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='levantamentoexternosembancas', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='levantamentoexternosembancas', json=None))
    
def agrupar_tarefas_egressos(id, anoi, anof):
    tarefas = []
    print('Acumulando unica tarefas egressos...')
    tarefas.append(tarefa_retorna_dados_egressos.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_tempo_de_atualizacao_do_lattes_egressos.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_quantidade_egressos_titulados_por_ano.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_producoes_egresso.s(id, anoi, anof))
    return tarefas