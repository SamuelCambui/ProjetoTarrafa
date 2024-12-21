import json
from google.protobuf.json_format import MessageToDict
from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2
from backend.schemas.grafico import *

#* Indicadores
@app_celery_queries.task
def tarefa_retorna_contagem_de_indprodart_com_listanegra(id : str, anoi : int, anof : int, lista_negra : list):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, lista_negra)
        retorno = messages_pb2.PpgJson(nome='dadosindprods', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='dadosindprods', json=None))
@app_celery_queries.task
def tarefa_retorna_contagem_de_qualis_com_listanegra(id : str, anoi : int, anof : int, lista_negra : list):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, lista_negra)
        retorno = messages_pb2.PpgJson(nome='dadosqualis', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='dadosqualis', json=None))
    
@app_celery_queries.task
def tarefa_retorna_contagem_de_qualis_do_lattes(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_qualis_do_lattes(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='contagemqualislattes', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='contagemqualislattes', json=None))
    
@app_celery_queries.task
def tarefa_retorna_contagem_de_qualis_discentes(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_qualis_discentes(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='contagemqualisdiscentes', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='contagemqualisdiscentes', json=None))

@app_celery_queries.task
def tarefa_retorna_estatisticas_de_artigos(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_estatisticas_de_artigos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='estatisticaartigos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='estatisticaartigos', json=None))

@app_celery_queries.task
def tarefa_retorna_estatisticas_de_artigos_ppgs_correlatos(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_estatisticas_de_artigos_ppgs_correlatos(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='estatisticaartigoscorrelatos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='estatisticaartigoscorrelatos', json=None))
    
@app_celery_queries.task
def tarefa_retorna_contagem_de_indprodart_absoluto(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_indprodart_absoluto(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='inprodartabsoluto', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='inprodartabsoluto', json=None))

@app_celery_queries.task
def tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_indprodart_extrato_superior_com_listanegra(id, anoi, anof, None)
        retorno = messages_pb2.PpgJson(nome='indprodartextratosuperior', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='indprodartextratosuperior', json=None))

@app_celery_queries.task
def tarefa_retorna_tempos_de_conclusao(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_tempos_de_conclusao(id, anoi, anof)
        retorno = messages_pb2.PpgJson(nome='tempoconclusao', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='tempoconclusao', json=None))
    
#TODO

# Padronizar o restante das funções

#* Funções Finalizadas

def padronizar_grafico_indicador(respostaDict : dict, data_avg : dict, label : str, indicador : str, nota : str):
    #* DataSets
    dataset = DataSet()
    dataset.label = label
    dataset.data = [data[indicador] for data in respostaDict[indicador]]
    
    dataset_avg = DataSet()
    dataset_avg.label = f'Avg {label} (PPGs nota {nota})'
    dataset_avg.data = [list(d.values())[0] for d in data_avg]
    
    #*DadosGraficos
    dados_grafico = DadosGrafico()
    dados_grafico.labels = [data['ano'] for data in respostaDict[indicador]]
    dados_grafico.datasets = [dataset, dataset_avg]
    
    #*Grafico
    grafico = Grafico()
    grafico.data = dados_grafico
    return messages_pb2.PpgJson(nome=indicador, json=json.dumps(grafico.to_dict()))


@app_celery_queries.task
def tarefa_retorna_indori_medio(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_indori_medio(id, anoi, anof)
        return respostaDict
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='indorimedio', json=None))
    
@app_celery_queries.task
def tarefa_retorna_inddistori_medio(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_inddistori_medio(id, anoi, anof)
        return respostaDict
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='inddistorimedio', json=None))
    
@app_celery_queries.task
def tarefa_retorna_indaut_medio(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_indaut_medio(id, anoi, anof)
        return respostaDict
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='indautmedio', json=None))
    
@app_celery_queries.task
def tarefa_retorna_inddis_medio(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_inddis_medio(id, anoi, anof)
        return respostaDict
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='inddismedio', json=None))
    
@app_celery_queries.task
def tarefa_retorna_partdis_medio(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_partdis_medio(id, anoi, anof)
        return respostaDict
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='partdismedio', json=None))
    
@app_celery_queries.task
def tarefa_retorna_indcoautoria_medio(id : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_indcoautoria_medio(id, anoi, anof)
        return respostaDict
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='indcoautoriamedio', json=None))

@app_celery_queries.task
def tarefa_retorna_indori(id : str, anoi : int, anof : int, nota : str):
    try:
        respostaDict = crud.queries_ppg.retorna_indori(id, anoi, anof)
        data_avg = tarefa_retorna_indori_medio.delay(id, anoi, anof).get(disable_sync_subtasks = False)
        retorno = padronizar_grafico_indicador(respostaDict, data_avg, 'IndDori', 'indori', nota)
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='indori', json=None))

@app_celery_queries.task
def tarefa_retorna_inddistori(id : str, anoi : int, anof : int, nota : str):
    try:
        respostaDict = crud.queries_ppg.retorna_inddistori(id, anoi, anof)
        data_avg = tarefa_retorna_inddistori_medio.delay(id, anoi, anof).get(disable_sync_subtasks = False)
        retorno = padronizar_grafico_indicador(respostaDict, data_avg, 'IndDistori', 'inddistori', nota)
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='inddistori', json=None))
    
@app_celery_queries.task
def tarefa_retorna_indaut(id : str, anoi : int, anof : int, nota : str):
    try:
        respostaDict = crud.queries_ppg.retorna_indaut(id, anoi, anof)
        data_avg = tarefa_retorna_indaut_medio.delay(id, anoi, anof).get(disable_sync_subtasks = False)
        retorno = padronizar_grafico_indicador(respostaDict, data_avg, 'IndAut', 'indaut', nota)
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='indaut', json=None))
    
@app_celery_queries.task
def tarefa_retorna_inddis(id : str, anoi : int, anof : int, nota : str):
    try:
        respostaDict = crud.queries_ppg.retorna_inddis(id, anoi, anof)
        data_avg = tarefa_retorna_inddis_medio.delay(id, anoi, anof).get(disable_sync_subtasks = False)
        retorno = padronizar_grafico_indicador(respostaDict, data_avg, 'IndDis', 'inddis', nota)
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='inddis', json=None))

    
@app_celery_queries.task
def tarefa_retorna_partdis(id : str, anoi : int, anof : int, nota : str):
    try:
        respostaDict = crud.queries_ppg.retorna_partdis(id, anoi, anof)
        data_avg = tarefa_retorna_partdis_medio.delay(id, anoi, anof).get(disable_sync_subtasks = False)
        retorno = padronizar_grafico_indicador(respostaDict, data_avg, 'PartDis', 'partdis', nota)
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='partdis', json=None))
    
@app_celery_queries.task
def tarefa_retorna_indcoautoria(id : str, anoi : int, anof : int, nota : str):
    try:
        respostaDict = crud.queries_ppg.retorna_indcoautoria(id, anoi, anof)
        data_avg = tarefa_retorna_indcoautoria_medio.delay(id, anoi, anof).get(disable_sync_subtasks = False)
        retorno = padronizar_grafico_indicador(respostaDict, data_avg, 'IndCoautoria', 'indcoautoria', nota)
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson(nome='indcoautoria', json=None))

def agrupar_tarefas_indicadores(id : str, anoi : int, anof : int, nota : str):
    tarefas = []
    print('Acumulando unica tarefas Indicadores padronizado...')
    tarefas.append(tarefa_retorna_contagem_de_indprodart_com_listanegra.s(id, anoi, anof, None))
    tarefas.append(tarefa_retorna_contagem_de_qualis_com_listanegra.s(id, anoi, anof, None))
    tarefas.append(tarefa_retorna_contagem_de_qualis_do_lattes.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_contagem_de_qualis_discentes.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_estatisticas_de_artigos.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_estatisticas_de_artigos_ppgs_correlatos.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_contagem_de_indprodart_absoluto.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra.s(id, anoi, anof))
    tarefas.append(tarefa_retorna_indori.s(id, anoi, anof, nota))
    tarefas.append(tarefa_retorna_inddistori.s(id, anoi, anof, nota))
    tarefas.append(tarefa_retorna_indaut.s(id, anoi, anof, nota))
    tarefas.append(tarefa_retorna_inddis.s(id, anoi, anof, nota))
    tarefas.append(tarefa_retorna_partdis.s(id, anoi, anof, nota))
    tarefas.append(tarefa_retorna_partdis.s(id, anoi, anof, nota))
    tarefas.append(tarefa_retorna_indcoautoria.s(id, anoi, anof, nota))
    return tarefas