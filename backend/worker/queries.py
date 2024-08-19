import json
from google.protobuf.json_format import MessageToDict

from . import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_verifica_usuario(username):
    try:
        user = crud.user.verify_in_db(email = username)
        return user
    except Exception as e:
        print(e)
        return None
    
@app_celery_queries.task
def tarefa_autentica_usuario(username, password):
    try:   
        user, useravatar = crud.user.authenticate(password=password, email=username)     
        return user, useravatar
    except Exception as e:
        print(e)
        return None, None

@app_celery_queries.task
def tarefa_retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, lista_negra):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, None)
        retorno = messages_pb2.PpgJson(nome='dadosindprods', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())

@app_celery_queries.task
def tarefa_retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, lista_negra):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, None)
        retorno = messages_pb2.PpgJson(nome='dadosqualis', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_contagem_de_qualis_do_lattes(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_qualis_do_lattes(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='contagemqualislattes', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_contagem_de_qualis_discentes(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_qualis_discentes(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='contagemqualisdiscentes', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())

@app_celery_queries.task
def tarefa_retorna_estatisticas_de_artigos(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_estatisticas_de_artigos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='estatisticaartigos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())

@app_celery_queries.task
def tarefa_retorna_estatisticas_de_artigos_ppgs_correlatos(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_estatisticas_de_artigos_ppgs_correlatos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='estatisticaartigoscorrelatos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_contagem_de_indprodart_absoluto(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_indprodart_absoluto(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='inprodart_absoluto', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())

@app_celery_queries.task
def tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_indprodart_extrato_superior_com_listanegra(id, anoi, anof, None)
        retorno = messages_pb2.PpgJson(nome='indprodartextratosuperior', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_indori(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_indori(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='indori', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_inddistori(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_inddistori(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='inddistori', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_indaut(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_indaut(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='indaut', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_inddis(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_inddis(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='inddis', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_partdis(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_partdis(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='partdis', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_indcoautoria(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_indcoautoria(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='indcoautoria', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_indori_medio(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_indori_medio(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='indorimedio', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_inddistori_medio(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_inddistori_medio(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='inddistorimedio', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_indaut_medio(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_indaut_medio(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='indautmedio', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_inddis_medio(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_inddis_medio(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='inddismedio', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_partdis_medio(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_partdis_medio(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='partdismedio', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_indcoautoria_medio(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_indcoautoria_medio(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='indcoautoriamedio', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    
@app_celery_queries.task
def tarefa_retorna_tempos_de_conclusao(id, anoi, anof):
    try:
        respostaDict = crud.queries_ppg.retorna_tempos_de_conclusao(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='tempoconclusao', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())