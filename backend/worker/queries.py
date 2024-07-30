import os
from celery import Celery
from celery.result import AsyncResult
from celery import shared_task

import zeep
import zipfile
import xmltodict
from xml.dom.minidom import parse
from bs4 import BeautifulSoup

import io
from psycopg2.extras import Json
import sys
from pathlib import Path
import json

import requests


# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent  # Ajuste conforme a necessidade
sys.path.append(str(diretorio_raiz))


from backend.core.config import settings
from backend.db.db import DBConnectorPPG
from backend.app import crud

import requests

from backend.app import crud

from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2
from google.protobuf.json_format import MessageToDict

@app_celery_queries.task
def tarefa_retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, lista_negra):
    #db = DBConnectorPPG()
    try:

        respostaDict = crud.queries_ppg.retorna_contagem_de_indprodart_com_listanegra(id, anoi, anof, None)
        retorno = messages_pb2.PpgJson(nome='dadosindprods', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())

@app_celery_queries.task
def tarefa_retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, lista_negra):
    # db = DBConnectorPPG()
    try:
        respostaDict = crud.queries_ppg.retorna_contagem_de_qualis_com_listanegra(id, anoi, anof, None)
        retorno = messages_pb2.PpgJson(nome='dadosqualis', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PpgJson())
    

##################################################################    

@app_celery_queries.task
def tarefa_retorna_contagem_de_qualis_discentes(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosqualisdiscente'] = crud.queries_ppg.retorna_contagem_de_qualis_discentes(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosqualisdiscente': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_estatisticas_de_artigos(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosartigosdiscente'] = crud.queries_ppg.retorna_estatisticas_de_artigos(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosartigosdiscente': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_contagem_de_indprodart_extrato_superior_com_listanegra(id, anoi, anof, lista_negra):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosextsup'] = crud.queries_ppg.retorna_contagem_de_indprodart_extrato_superior_com_listanegra(id, anoi, anof, None, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosextsup': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_dados_posicoes(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosposition'] = crud.queries_ppg.retorna_dados_posicoes(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosposition': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_tempos_de_conclusao(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadostempodefesa'] = crud.queries_ppg.retorna_tempos_de_conclusao(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadostempodefesa': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_quantidade_de_discentes_titulados(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosestudantestitulados'] = crud.queries_ppg.retorna_quantidade_de_discentes_titulados(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosestudantestitulados': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_indori(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosindori'] = crud.queries_ppg.retorna_indori(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosindori': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_inddistori(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosinddistori'] = crud.queries_ppg.retorna_inddistori(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosinddistori': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_indaut(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosindaut'] = crud.queries_ppg.retorna_indaut(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosindaut': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_inddis(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosinddis'] = crud.queries_ppg.retorna_inddis(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosinddis': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_partdis(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadospartdis'] = crud.queries_ppg.retorna_partdis(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadospartdis': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_indcoautoria(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosindcoautoria'] = crud.queries_ppg.retorna_indcoautoria(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosindcoautoria': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_indori_medio(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosavgindori'] = crud.queries_ppg.retorna_indori_medio(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosavgindori': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_inddistori_medio(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosavginddistori'] = crud.queries_ppg.retorna_inddistori_medio(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosavginddistori': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_indaut_medio(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosavgindaut'] = crud.queries_ppg.retorna_indaut_medio(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosavgindaut': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_inddis_medio(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosavginddis'] = crud.queries_ppg.retotrna_inddis_medio(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosavginddis': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_partdis_medio(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosavgpartdis'] = crud.queries_ppg.retorna_partdis_medio(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosavgpartdis': {}}
    # finally:
    #     db.close()

@app_celery_queries.task
def tarefa_retorna_indcoautoria_medio(id, anoi, anof):
    db = DBConnectorPPG()
    try:
        retornos = {}
        retornos['dadosavgindcoautoria'] = crud.queries_ppg.retorna_indcoautoria_medio(id, anoi, anof, db)
        return retornos
    except Exception as e:
        print(e)
        return {'dadosavgindcoautoria': {}}
    # finally:
    #     db.close()

    