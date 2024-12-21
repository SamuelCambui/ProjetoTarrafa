import json
from google.protobuf.json_format import MessageToDict
from .. import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2
from celery import group

@app_celery_queries.task
def tarefa_retorna_lista_programas(id_ies : str):
    try:
        respostaDict = crud.queries_ppg.retorna_lista_programas(id_ies)
        retorno = messages_pb2.HomeResponse(nome='listaProgramas', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.HomeResponse(nome='listaProgramas', json=None))
@app_celery_queries.task
def tarefa_retorna_dados_home(id_ies : str):
    try:
        respostaDict = crud.queries_ppg.retorna_dados_home(id_ies)
        retorno = messages_pb2.HomeResponse(nome='dadosHome', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.HomeResponse(nome='dadosHome', json=None))
    
@app_celery_queries.task
def tarefa_retorna_lista_de_artigos_da_universidade(id_ies : str, ano : int):
    try:
        respostaDict = crud.queries_ppg.retorna_lista_de_artigos_da_universidade(id_ies, ano)
        retorno = messages_pb2.HomeResponse(nome='listAartigos', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.HomeResponse(nome='listaArtigos', json=None))

@app_celery_queries.task
def tarefa_retorna_grafo_de_coautores_por_subtipo(id_ies : str, produto : str, tipo : str, anoi : int, anof : int):
    try:
        respostaDict = crud.queries_ppg.retorna_grafo_de_coautores_por_subtipo(id_ies, produto, tipo, anoi, anof)
        retorno = messages_pb2.HomeResponse(nome='grafoCoautores', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.HomeResponse(nome='grafoCoautores', json=None))

@app_celery_queries.task
def tarefa_retorna_lista_de_professores_atuais_para_ranking(id_prog : str):
    try:
        respostaDict = crud.queries_ppg.retorna_lista_de_professores_atuais_para_ranking(id_prog)
        retorno = messages_pb2.HomeResponse(nome='listaProfessores', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.HomeResponse(nome='listaProfessores', json=None))

def get_sort_key(item):
    produtos = item[1].get('produtos', {})
    return (
        produtos.get('ARTIGO-PUBLICADO', 0),
        produtos.get('TRABALHO-EM-EVENTOS', 0),
        produtos.get('LIVROS-PUBLICADOS-OU-ORGANIZADOS', 0),
        produtos.get('CAPITULOS-DE-LIVROS-PUBLICADOS', 0)
    )

@app_celery_queries.task
def tarefa_retorna_ranking_docentes(id_ies : str):
    try:
        programas = tarefa_retorna_lista_programas.delay(id_ies).get(disable_sync_subtasks = False)
        programas = json.loads(programas['json'])
        tarefas = [tarefa_retorna_lista_de_professores_atuais_para_ranking.s(programa['id']) for programa in programas]
        
        lista_tarefas = group(tarefas)
        retorno_tarefas = lista_tarefas.apply_async()
        
        lista = retorno_tarefas.get(disable_sync_subtasks=False)
        
        retorno = [json.loads(subitem['json']) for subitem in lista]
        
        professores = {}
        
        professores.update({
            prof['num_identificador']: {
                'nome': prof['nome'],
                'ies': prof['ies'] if prof['ies'] != '' and prof['ies'] is not None else (
                    programas[0]['nome_ies'] if prof['tipo_vinculo_ies'] == 1 else 'Informação não encontrada'
                ),
                'vinculo_ies': prof['vinculo_ies'],
                'sigla_ies_vinculo': programas[0]['sigla_ies']
            }
            for sublista in retorno for prof in sublista['professores']
        })

        professores.update({
            prof: {**professores[prof], 'avatar': sublista['avatares'][prof]}
            for sublista in retorno for prof in sublista['avatares']
        })
        
        for sublista in retorno:
            for prof in sublista['produtos']:
                professores[prof].setdefault('produtos', {}).update({
                    subtipo['subtipo']: subtipo['qdade']
                    for subtipo in sublista['produtos'][prof]
                })

        
        dicionario_ordenado = dict(sorted(professores.items(), key=get_sort_key, reverse=True))
        retorno = messages_pb2.HomeResponse(nome='rankingDocentes', json=json.dumps(dicionario_ordenado))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.HomeResponse(nome='rankingDocentes', json=None))