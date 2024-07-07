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
from backend.db.cache import RedisConnector
import asyncio

import requests

import unicodedata


from backend.worker.celery_start_tasks import app_celery
from backend.app import *


# app_celery.conf.task_queues = {
#     'default': {
#         'exchange': 'default',
#         'routing_key': 'default',
#     },
#     'fila_tarefas': {
#         'exchange': 'fila_tarefas',
#         'routing_key': 'fila_tarefas',
#     },
#     'fila_despachante': {
#         'exchange': 'fila_despachante',
#         'routing_key': 'fila_despachante',
#     },
# }

# # Definir roteamento padrão para tarefas
# app_celery.conf.task_routes = {
#     'backend.tasks.insert': {'queue': 'fila_tarefas'},
#     'backend.tasks.baixar_e_inserir': {'queue': 'fila_tarefas'},
#     'backend.despachante.consome_progresso': {'queue': 'fila_despachante'},
#     'backend.despachante.consome_tarefas': {'queue': 'fila_despachante'},
# }


#Estudar maneiras fazer classes customizadas para as tarefas
#Saber usuar @property dentro da classes para usar nas tasks
#Seria melhor de organizar do que só jogar a variavel lá

# class DbTask(app_celery.Task):

#     _db = None

#     @property
#     def db(self):
#         _db =  get_db()
#         return _db

# ====================================================================
# @app.task(name = "porcentagem_redis")
# def aumentar_porcentagem_redis(ret):
#     r = Redis()
#     verificacao = r.exists('porcentagem')
#     if not verificacao:
#         r.set('porcentagem', 1)
    
#     valor_atual = int(r.get('porcentagem'))
#     if ret:
#         valor_atual+=1
#         r.set('porcentagem', valor_atual)
    
#     if valor_atual >= 100:
#         r.delete('porcentagem')
    
#     return True

# =====================================================================
def puxar_dados_task(task_id) -> AsyncResult:
    """
    Função responsável por pegar os dados de um tarefa no celery, dado seu id

    task_id : Id da Task do celery
    """
    result = app_celery.AsyncResult(task_id)
    return result

def verificaLattes(id=None):
        if id is None:
            return False
        try:
            url = f"http://lattes.cnpq.br/{id}"
            headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.0; WOW64; rv:24.0) Gecko/20100101 Firefox/24.0' }
            r = requests.get(url, headers=headers)
            soup = BeautifulSoup(r.content, features="html.parser")
    
            if soup.find(id="id") is not None:
                tag = soup.find(id="id")
                return True
            else:
                return False
        except Exception as e:
            return False
        
def test_int(valor):
    try:
        ano = int(valor)
    except:
        return False
    return True
        
def getImgLattes(id, db):
    if id is None:
        return ''
    try:
        if verificaLattes(id):
            url = f"http://lattes.cnpq.br/{id}"
            headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.0; WOW64; rv:24.0) Gecko/20100101 Firefox/24.0' }
            r = requests.get(url, headers=headers)
            soup = BeautifulSoup(r.content, features="html.parser")

            if soup.find(id="id") is not None:
                tag = soup.find(id="id")
                return f"http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id={tag['value']}"
        else:
            linkavatar = db.fetch_one(f"select linkavatar from curriculos_lattes where idlattes = '{id}'")
            return linkavatar[0]

        return ''
    except Exception as e:
        return ''
    
def processar_projetos(atuacoes, db, id_ies):
    info_ppg = db.fetch_one(f"select nome, sigla from instituicoes where id_ies = '{id_ies}'")

    projetos_pesquisa = []
    
    if atuacoes is None:
        return []

    if type(atuacoes) == dict:
        atuacoes = [atuacoes]
        
    for atuacao in atuacoes:
        try:
            nm_instituicao = strip_accents(atuacao['@NOME-INSTITUICAO'])
            info_ppg['nome'] = strip_accents(info_ppg['nome'])
            if info_ppg['nome'].upper() == nm_instituicao.upper() or nm_instituicao.upper() == info_ppg['sigla'].upper():

                cd_instituicao = None
                if '@CODIGO-INSTITUICAO' in atuacao:
                    cd_instituicao = atuacao['@CODIGO-INSTITUICAO']
                if 'ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO' in atuacao:
                    if 'PARTICIPACAO-EM-PROJETO' in atuacao['ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO']:
                        projs = atuacao['ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO']['PARTICIPACAO-EM-PROJETO']
                        if type(projs) != list:
                            projs = [projs]
                        if type(projs) == list:
                            for projeto in projs:
                                #print(projeto['@ANO-INICIO'],projeto['@ANO-FIM'], end=': ')
                                orgao = ''
                                if '@NOME-ORGAO' in projeto:
                                    orgao = projeto['@NOME-ORGAO']
                                    
                                
                                panos = projeto['PROJETO-DE-PESQUISA'] if 'PROJETO-DE-PESQUISA' in projeto else None
                                if panos:
                                    if type(panos) != list:
                                        panos = [panos]
                                    if type(panos) == list:
                                        for pano in panos:
                                            integrantes = []
                                            if 'EQUIPE-DO-PROJETO' in pano:
                                                if type(pano['EQUIPE-DO-PROJETO']['INTEGRANTES-DO-PROJETO']) == list:
                                                    for i in pano['EQUIPE-DO-PROJETO']['INTEGRANTES-DO-PROJETO']:
                                                        integrantes.append(i)
                                                else:
                                                        integrantes.append(pano['EQUIPE-DO-PROJETO']['INTEGRANTES-DO-PROJETO'])
                                            situacao = ''
                                            if '@SITUACAO' in pano:
                                                situacao = pano['@SITUACAO']                                        
                                            
                                            descricao = ''
                                            if '@DESCRICAO-DO-PROJETO' in pano and pano['@DESCRICAO-DO-PROJETO']:
                                                descricao = pano['@DESCRICAO-DO-PROJETO']
                                                
                                            
                                            
                                            num_doutorado = 0
                                            if '@NUMERO-DOUTORADO' in pano and pano['@NUMERO-DOUTORADO']:
                                                num_doutorado = int(pano['@NUMERO-DOUTORADO']) if test_int(pano['@NUMERO-DOUTORADO']) else 0
                                                
                                            num_especializacao = 0
                                            if '@NUMERO-ESPECIALIZACAO' in pano and pano['@NUMERO-ESPECIALIZACAO']:
                                                num_especializacao = int(pano['@NUMERO-ESPECIALIZACAO']) if test_int(pano['@NUMERO-ESPECIALIZACAO']) else 0
                                                
                                            num_graduacao = 0
                                            if '@NUMERO-GRADUACAO' in pano and pano['@NUMERO-GRADUACAO']:
                                                num_graduacao = int(pano['@NUMERO-GRADUACAO']) if test_int(pano['@NUMERO-GRADUACAO']) else 0
                                                
                                            num_mestrado = 0
                                            if '@NUMERO-MESTRADO-ACADEMICO' in pano and pano['@NUMERO-MESTRADO-ACADEMICO']:
                                                num_mestrado = int(pano['@NUMERO-MESTRADO-ACADEMICO']) if test_int(pano['@NUMERO-MESTRADO-ACADEMICO']) else 0
                                            if '@NUMERO-MESTRADO-PROF' in pano and pano['@NUMERO-MESTRADO-PROF']:
                                                num_mestrado += int(pano['@NUMERO-MESTRADO-PROF']) if test_int(pano['@NUMERO-MESTRADO-PROF']) else 0
                                                
                                            projetos_pesquisa.append({
                                                'nm_projeto' : pano['@NOME-DO-PROJETO'].replace("'",""),
                                                'nm_instituicao':nm_instituicao,
                                                'cd_instituicao':cd_instituicao,
                                                'orgao':orgao,
                                                'ano_inicio' : int(pano['@ANO-INICIO']) if test_int(pano['@ANO-INICIO']) else 0,
                                                'ano_fim' : int(pano['@ANO-FIM']) if test_int(pano['@ANO-FIM']) else 0,
                                                'integrantes':Json(integrantes),
                                                'situacao':situacao,
                                                'natureza' : pano['@NATUREZA'],
                                                'descricao' : descricao.replace("'",""),
                                                'num_doutorado' : num_doutorado,
                                                'num_especializacao' : num_especializacao,
                                                'num_graduacao' : num_graduacao,
                                                'num_mestrado' : num_mestrado,
                                                'producoes' : Json(pano['PRODUCOES-CT-DO-PROJETO']) if 'PRODUCOES-CT-DO-PROJETO' in pano else Json([])
                                                })
                                                
        except Exception as e:
            print('Erro ao processar projetos:', e)
            pass
        #docentes[doc['CURRICULO-VITAE']['DADOS-GERAIS']['@NOME-COMPLETO']]['projetos'] = pd.DataFrame(projetos, columns=['titulo','ano inicio','ano fim'])    
    return projetos_pesquisa
    
def processar_producoes(producoes):
    prods = {}
    
    for k in producoes.keys():
        try:
            if type(producoes[k]) == dict:
                subk = list(producoes[k].keys())
                test_atributos = [True for sk in subk if '@' in sk]
                if True not in test_atributos:
                    for sk in subk:

                        l = None
                        if sk == 'CAPITULOS-DE-LIVROS-PUBLICADOS':
                            l = producoes[k][sk]['CAPITULO-DE-LIVRO-PUBLICADO']
                        elif sk == 'LIVROS-PUBLICADOS-OU-ORGANIZADOS':
                            l = producoes[k][sk]['LIVRO-PUBLICADO-OU-ORGANIZADO']
                        else:
                            l = producoes[k][sk]

                        if type(l) == list:
                            for i in l:
                                if sk not in prods:
                                    prods[sk] = []
                                prods[sk].append(i)
                        else:
                            if sk not in prods:
                                prods[sk] = []
                            prods[sk].append(l)
                else:
                    if k not in prods:
                        prods[k] = []
                    prods[k].append(producoes[k])
            else:
                l = producoes[k]
                if type(l) == list:
                    for i in l:
                        if k not in prods:
                            prods[k] = []
                        prods[k].append(i)
                else:
                    if k not in prods:
                        prods[k] = []
                    prods[k].append(l)
                
        except Exception as e:
            return None
                
    return prods
    
def strip_accents(text):
    """
    Strip accents from input String.

    :param text: The input string.
    :type text: String.

    :returns: The processed String.
    :rtype: String.
    """
    
    text = unicodedata.normalize('NFD', text)
    text = text.encode('ascii', 'ignore')
    text = text.decode("utf-8")
    return str(text)
    

       
    
#@app_celery.task(name = "processar_curriculos")
@shared_task
def insert(row, id_ies, chave):
    db = DBConnectorPPG()
    cursor = db.getCursor()

    redis = RedisConnector()


    lattes = row[3]
    cpf = ''
    id_lattes = row[0]

    lista_inserts = []

    try:
        #id_lattes = lattes['CURRICULO-VITAE']['@NUMERO-IDENTIFICADOR']
        nome = strip_accents(lattes['CURRICULO-VITAE']['DADOS-GERAIS']['@NOME-COMPLETO']).replace("'"," ")
        citacoes = (lattes["CURRICULO-VITAE"]["DADOS-GERAIS"]["@NOME-EM-CITACOES-BIBLIOGRAFICAS"]).replace("'"," ")
        #rows_ids = busca_nome(nome) #, citacoes)
        ids_sucupira = ''
        #if len(rows_ids) > 0:
        #    ids_sucupira = (',').join([str(num) for num in rows_ids])

        
        
        lista_inserts.append(f"""      
                        INSERT INTO lattes_docentes(
                        num_identificador, dt_atualizacao, hr_atualizacao, cpf, nm_completo, nm_citacoes, id_sucupira, linkavatar)
                        VALUES ('{id_lattes}', 
                                '{lattes["CURRICULO-VITAE"]["@DATA-ATUALIZACAO"]}', 
                                '{lattes["CURRICULO-VITAE"]["@HORA-ATUALIZACAO"]}', 
                                '{cpf}', '{nome}', 
                                '',
                                '{ids_sucupira}',
                                '{getImgLattes(id_lattes, db)}')
                        ON CONFLICT (num_identificador) DO UPDATE
                        SET (dt_atualizacao, hr_atualizacao, cpf, nm_completo, nm_citacoes, id_sucupira, linkavatar) =
                            (excluded.dt_atualizacao, excluded.hr_atualizacao, excluded.cpf, excluded.nm_completo, excluded.nm_citacoes, excluded.id_sucupira, excluded.linkavatar)                                
                        """)
                        
        dados_gerais  = Json(lattes["CURRICULO-VITAE"]["DADOS-GERAIS"])
                        
        lista_inserts.append(f"""      
                        INSERT INTO lattes_dados_gerais(
                            num_identificador, dados)
                            VALUES ('{id_lattes}', {dados_gerais})
                            ON CONFLICT (num_identificador) DO UPDATE
                            SET dados = excluded.dados
                            """)
                            
        dados_complementares  = Json(lattes["CURRICULO-VITAE"]["DADOS-COMPLEMENTARES"])
                        
        lista_inserts.append(f"""      
                        INSERT INTO lattes_dados_complementares(
                            num_identificador, dados)
                            VALUES ('{id_lattes}', {dados_complementares})
                            ON CONFLICT (num_identificador) DO UPDATE
                            SET dados = excluded.dados
                            """)
        
        
        if "OUTRA-PRODUCAO" in lattes["CURRICULO-VITAE"]:              
            dados_outra  = lattes["CURRICULO-VITAE"]["OUTRA-PRODUCAO"]
            if dados_outra:
                outra = processar_producoes(dados_outra)
                            
                for k in outra.keys():
                    b = Json(outra[k])
                    lista_inserts.append(f"""      
                                INSERT INTO lattes_outra_producao(
                                    num_identificador, tipo, dados)
                                    VALUES ('{id_lattes}', '{k}', {b})
                                    ON CONFLICT (num_identificador, tipo) DO UPDATE
                                    SET dados = excluded.dados
                                    """)
        if "PRODUCAO-BIBLIOGRAFICA" in lattes["CURRICULO-VITAE"]:               
            dados_biblio  = lattes["CURRICULO-VITAE"]["PRODUCAO-BIBLIOGRAFICA"]
            #livros = None
            #if 'LIVROS-E-CAPITULOS' in dados_biblio:
            #    livros = {'LIVROS-E-CAPITULOS': dados_biblio['LIVROS-E-CAPITULOS']}
            #    dados_biblio.pop('LIVROS-E-CAPITULOS')
            if dados_biblio:
                biblio = processar_producoes(dados_biblio)
            
                for k in biblio.keys():
                    b = Json(biblio[k])
                    lista_inserts.append(f"""      
                                INSERT INTO lattes_producao_bibliografica(
                                    num_identificador, tipo, dados)
                                    VALUES ('{id_lattes}', '{k}', {b})
                                    ON CONFLICT (num_identificador, tipo) DO UPDATE
                                    SET dados = excluded.dados
                                    """)
                            
        #if livros:
        #    outra = processar_producoes(livros)
        #                    
        #    for k in outra.keys():
        #        b = Json(outra[k])
        ##        lista_inserts.append(f"""      
        #                    INSERT INTO lattes_producao_bibliografica(
        #                        num_identificador, tipo, dados)
        #                        VALUES ('{id_lattes}', '{k}', {b})
        #                     """)
                    
        if "PRODUCAO-TECNICA" in lattes["CURRICULO-VITAE"]: 
            dados_tec  = lattes["CURRICULO-VITAE"]["PRODUCAO-TECNICA"]
            if dados_tec:
                tec = processar_producoes(dados_tec)
            
                for k in tec.keys():
                    b = Json(tec[k])                
                    lista_inserts.append(f"""      
                                INSERT INTO lattes_producao_tecnica(
                                    num_identificador, tipo, dados)
                                    VALUES ('{id_lattes}', '{k}', {b})
                                    ON CONFLICT (num_identificador, tipo) DO UPDATE
                                    SET dados = excluded.dados
                                    """)
        if "DADOS-GERAIS" in lattes["CURRICULO-VITAE"]:
            if lattes['CURRICULO-VITAE']['DADOS-GERAIS'] and 'ATUACOES-PROFISSIONAIS' in lattes['CURRICULO-VITAE']['DADOS-GERAIS']:
                if lattes['CURRICULO-VITAE']['DADOS-GERAIS']['ATUACOES-PROFISSIONAIS'] and 'ATUACAO-PROFISSIONAL' in lattes['CURRICULO-VITAE']['DADOS-GERAIS']['ATUACOES-PROFISSIONAIS']:
                    projetos = processar_projetos(lattes['CURRICULO-VITAE']['DADOS-GERAIS']['ATUACOES-PROFISSIONAIS']['ATUACAO-PROFISSIONAL'], db, id_ies)
                    
                    for proj in projetos:
                        query = f"""      
                                        INSERT INTO lattes_projetos(
                                                    num_identificador, nm_projeto, ano_inicio, ano_fim, nm_instituicao, 
                                                    cd_instituicao, orgao, integrantes, situacao, 
                                                    natureza, descricao, num_doutorado, num_mestrado, 
                                                    num_especializacao, num_graduacao, producoes)
                                        VALUES (
                                            '{id_lattes}',
                                            '{proj['nm_projeto']}',
                                            {proj['ano_inicio']},
                                            {proj['ano_fim']},
                                            '{proj['nm_instituicao']}',
                                            '{proj['cd_instituicao']}',
                                            '{proj['orgao']}',
                                            {proj['integrantes']},
                                            '{proj['situacao']}',
                                            '{proj['natureza']}',
                                            '{proj['descricao']}',
                                            {proj['num_doutorado']},
                                            {proj['num_mestrado']},
                                            {proj['num_especializacao']},
                                            {proj['num_graduacao']},
                                            {proj['producoes']})
                                        ON CONFLICT (num_identificador, nm_projeto, ano_inicio) DO UPDATE
                                        SET (ano_fim, nm_instituicao, 
                                        cd_instituicao, orgao, integrantes, situacao, 
                                        natureza, descricao, num_doutorado, num_mestrado, 
                                        num_especializacao, num_graduacao, producoes) =
                                        (excluded.ano_fim, excluded.nm_instituicao, 
                                        excluded.cd_instituicao, excluded.orgao, excluded.integrantes, excluded.situacao, 
                                        excluded.natureza, excluded.descricao, excluded.num_doutorado, excluded.num_mestrado, 
                                        excluded.num_especializacao, excluded.num_graduacao, excluded.producoes)
                                        
                                            """
                        lista_inserts.append(query)
        
        
#             db.insert(f"""
#                 INSERT INTO curriculos_lattes(
#                     idlattes, cpf, linkavatar, dados, curriculo, dt_atualizacao)
#                     VALUES ('{idlattes}', '{cpf}', '{linkavatar}', {dados}, {curriculo},'{dt_atualizacao}')
#                 ON CONFLICT DO NOTHING
#                 RETURNING idlattes
#             """)


        for e, qinsert in enumerate(lista_inserts):
            cursor.execute(qinsert)
        
        # Salva as mudanças no banco de dados
        db.dbconn.commit()

        channel.basic_publish(
                exchange='',
                routing_key=settings.FILA_PROGRESSOS,
                body=json.dumps({'chave':chave, 'operacao': 'decr', 'valor': 1}),
                properties=pika.BasicProperties(
                    delivery_mode=pika.DeliveryMode.Persistent
                ))

        # if redis.isConnected():
        # #     # redis.push(settings.FILA_PROGRESSOS, chave+'_sucesso')
        # #     redis.incr(f'{settings.FILA_TAREFAS_CURRICULOS}_sucesso')
        # #     redis.decr(f'{settings.FILA_TAREFAS_CURRICULOS}_total')
        # #     #redis.incr(chave+'_sucesso')
        #     redis.push(settings.FILA_PROGRESSOS, {'chave':chave, 'operacao': 'decr', 'valor': 1})

        return True
    except Exception as err:
        print(err)
        db.dbconn.rollback()
        # if redis.isConnected():
        #     # redis.push(settings.FILA_PROGRESSOS, chave+'_erro')
        #     redis.incr(f'{settings.FILA_TAREFAS_CURRICULOS}_erro')
        #     redis.decr(f'{settings.FILA_TAREFAS_CURRICULOS}_total')
        #     #redis.incr(chave+'_erro')
        return False
    finally:
        cursor.close()
        db.close()

def insert_lattes(cpf, idlattes, linkavatar, dados, curriculo, dt_atualizacao, db):
    try:
        ret = db.insert(f"""
            INSERT INTO curriculos_lattes(
                idlattes, cpf, linkavatar, dados, curriculo, dt_atualizacao)
                VALUES ('{idlattes}', '{cpf}', '{linkavatar}', {dados}, {curriculo},'{dt_atualizacao}')
            ON CONFLICT (idlattes) DO UPDATE
                        SET (cpf, linkavatar, dados, curriculo, dt_atualizacao) =
                            (excluded.cpf, excluded.linkavatar, excluded.dados, excluded.curriculo, excluded.dt_atualizacao) 
        """)

        print('inseriu curriculo: ', idlattes)
        return ret
    
    except Exception as err:
        return False

#@app_celery.task(name = "baixar_curriculos")
@shared_task
def baixar_e_inserir(idl, chave): #, arq):
    db = DBConnectorPPG()
    redis = RedisConnector()

    wsdl = 'http://servicosweb.cnpq.br/srvcurriculo/WSCurriculo?wsdl'
    
    # db = DBConnectorPPG()
    # redis = RedisConnector()

    c = zeep.Client(wsdl=wsdl)
    
    try:    
        #idl=c.service.getIdentificadorCNPq(cpf=cpfProf,nomeCompleto='',dataNascimento='')
        #print(cpfProf, getImgLattes(idl))   
        cpfProf = ''                 
        
        if idl is not None:
            file_content=c.service.getCurriculoCompactado(id=idl)
            if c.service.getOcorrenciaCV(idl) == 'Curriculo recuperado com sucesso!':
                input_zip = zipfile.ZipFile(io.BytesIO(file_content))
                a = input_zip.filelist.copy()
                nome = a.pop()
                with input_zip.open(nome.filename, mode="r") as curriculo:
                    obj = parse(curriculo)
                    doc = xmltodict.parse(obj.toxml())
                    if doc:
                        if insert_lattes(cpfProf, idl, getImgLattes(idl, db), Json({}), Json(doc), doc['CURRICULO-VITAE']['@DATA-ATUALIZACAO'], db):
                            #print("Inseriu:",doc['CURRICULO-VITAE']['DADOS-GERAIS']['@NOME-COMPLETO'], idl)
                            # if redis.isConnected():
                            #     # redis.push(settings.FILA_PROGRESSOS, chave+'_sucesso')
                            #     # redis.incr(f'{settings.FILA_TAREFAS_CURRICULOS}_sucesso')
                            #     # redis.decr(f'{settings.FILA_TAREFAS_CURRICULOS}_total')
                            #     #redis.incr(chave+'_sucesso')
                            #     redis.push(settings.FILA_PROGRESSOS, {'chave':chave, 'operacao': 'decr', 'valor': 1})
                            channel.basic_publish(
                                exchange='',
                                routing_key=settings.FILA_PROGRESSOS,
                                body=json.dumps({'chave':chave, 'operacao': 'decr', 'valor': 1}),
                                properties=pika.BasicProperties(
                                    delivery_mode=pika.DeliveryMode.Persistent
                                ))
                            return True
        

        # if redis.isConnected():
        #     # redis.push(settings.FILA_PROGRESSOS, chave+'_erro')
        #     redis.incr(f'{settings.FILA_TAREFAS_CURRICULOS}_erro')
        #     redis.decr(f'{settings.FILA_TAREFAS_CURRICULOS}_total')
        #     #redis.incr(chave+'_erro')
        
        return False
                    

    except Exception as e:
        # if redis.isConnected():
        #     # redis.push(settings.FILA_PROGRESSOS, chave+'_erro')
        #     redis.incr(f'{settings.FILA_TAREFAS_CURRICULOS}_erro')
        #     redis.decr(f'{settings.FILA_TAREFAS_CURRICULOS}_total')
        #     #redis.incr(chave+'_erro')
        
        return False
    finally:
        db.close()

#@shared_task
def aba_indicadores(id_ppg, anoi, anof, chave, token):
    
    print(f'tentando abrir sessao de requisicoes para {id_ppg} [{anoi},{anof}]')
    with requests.Session() as reqsession:
        print(f'iniciando requisições para aba indicadores para {id_ppg} [{anoi},{anof}]')
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/indprodart/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
            if ret.status_code == 400:
                print(ret.text)
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/artigosqualis/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
            if ret.status_code == 400:
                print(ret.text)
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/artigosqualisdiscente/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
            if ret.status_code == 400:
                print(ret.text)
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/estatisticasartigosdiscente/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
            if ret.status_code == 400:
                print(ret.text)
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/indprodartextsup/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
            if ret.status_code == 400:
                print(ret.text)
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/position/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
            if ret.status_code == 400:
                print(ret.text)
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/tempo/conclusoes/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/docentes/discentes/titulados/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/partdis/avg/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/partdis/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/indcoautoria/avg/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/indcoautoria/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/indori/avg/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/indori/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/inddistori/avg/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/inddistori/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/indaut/avg/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/indaut/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/inddis/avg/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/inddis/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except Exception as e:
            print(e)

        print(f'finalizando requisições para {id_ppg}')

    

    # try:
    #     redis = RedisConnector()
    #     if redis.isConnected():
    #         print(f'Incrementando chave {chave}_sucesso')
    #         # redis.push(settings.FILA_PROGRESSOS, chave+'_sucesso')
    #         redis.incr(f'{settings.FILA_TAREFAS_CRITICAS}_sucesso')
    #         redis.decr(f'{settings.FILA_TAREFAS_CRITICAS}_total')
            
    # except:
    #     print(f'Erro ao incrementar {chave}_sucesso')
    #     return False

    return True

@shared_task
def aba_docentes(id_ppg, anoi, anof, chave, token):
    print(f'tentando abrir sessao de requisicoes para {id_ppg} [{anoi},{anof}]')
    with requests.Session() as reqsession:
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/docentes/lista/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/docentes/coautores/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/docentes/lattesatualizacao/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/docentes/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass
        
        print(f'finalizando requisições para {id_ppg}')

    # try:
    #     redis = RedisConnector()
    #     if redis.isConnected():
    #         print(f'Incrementando chave {chave}_sucesso')
    #         # redis.push(settings.FILA_PROGRESSOS, chave+'_sucesso')
    #         redis.incr(f'{settings.FILA_TAREFAS_CRITICAS}_sucesso')
    #         redis.decr(f'{settings.FILA_TAREFAS_CRITICAS}_total')
    # except:
    #     print(f'Erro ao incrementar {chave}_sucesso')
    #     return False

    return True

@shared_task
def aba_projetos(id_ppg, anoi, anof, chave, token):
    print(f'tentando abrir sessao de requisicoes para {id_ppg} [{anoi},{anof}]')
    with requests.Session() as reqsession:
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/projetos/producaolinha/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/projetos/projetolinha/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/projetos/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass

        print(f'finalizando requisições para {id_ppg}')

    # try:
    #     redis = RedisConnector()
    #     if redis.isConnected():
    #         print(f'Incrementando chave {chave}_sucesso')
    #         # redis.push(settings.FILA_PROGRESSOS, chave+'_sucesso')
    #         redis.incr(f'{settings.FILA_TAREFAS_CRITICAS}_sucesso')
    #         redis.decr(f'{settings.FILA_TAREFAS_CRITICAS}_total')
    # except:
    #     print(f'Erro ao incrementar {chave}_sucesso')
    #     return False

    return True

@shared_task
def aba_bancas(id_ppg, anoi, anof, chave, token):
    print(f'tentando abrir sessao de requisicoes para {id_ppg} [{anoi},{anof}]')
    with requests.Session() as reqsession:
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/bancas/tccs/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/bancas/tccs/produtos/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/bancas/bancas/externos/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass

        print(f'finalizando requisições para {id_ppg}')

    # try:
    #     redis = RedisConnector()
    #     if redis.isConnected():
    #         print(f'Incrementando chave {chave}_sucesso')
    #         # redis.push(settings.FILA_PROGRESSOS, chave+'_sucesso')
    #         redis.incr(f'{settings.FILA_TAREFAS_CRITICAS}_sucesso')
    #         redis.decr(f'{settings.FILA_TAREFAS_CRITICAS}_total')
    # except:
    #     print(f'Erro ao incrementar {chave}_sucesso')
    #     return False

    return True

@shared_task
def aba_correlatos(id_ppg, anoi, anof, chave, token):
    print(f'tentando abrir sessao de requisicoes para {id_ppg} [{anoi},{anof}]')
    with requests.Session() as reqsession:
        try:
            ret = reqsession.get(f"{settings.BACKEND_HOST}{settings.API_STR}/ppg/indicadores/estatisticasartigosdiscente_correlatos/{id_ppg}/{anoi}/{anof}", headers = {
                    'accept': 'application/json',
                    'Authorization': f"Bearer {token}"
                })
        except:
            pass

        print(f'finalizando requisições para {id_ppg}')

    # try:
    #     redis = RedisConnector()
    #     if redis.isConnected():
    #         print(f'Incrementando chave {chave}_sucesso')
    #         # redis.push(settings.FILA_PROGRESSOS, chave+'_sucesso')
    #         redis.incr(f'{settings.FILA_TAREFAS_CRITICAS}_sucesso')
    #         redis.decr(f'{settings.FILA_TAREFAS_CRITICAS}_total')
    # except:
    #     print(f'Erro ao incrementar {chave}_sucesso')
    #     return False

    return True


#@shared_task
def processa_aba(id, anoi, anof, aba, chave, token): 
    
    if aba == 'indicadores':
        #aba_indicadores.apply_async(args=[id, anoi, anof, chave, token], expires=300)
        aba_indicadores(id, anoi, anof, chave, token)
    elif aba == 'docentes':
        aba_docentes.apply_async(args=[id, anoi, anof, chave, token], expires=300)
    elif aba == 'projetos':
        aba_projetos.apply_async(args=[id, anoi, anof, chave, token], expires=300)
    elif aba == 'bancas':
        aba_bancas.apply_async(args=[id, anoi, anof, chave, token], expires=300)
    elif aba == 'correlatos':
        aba_correlatos.apply_async(args=[id, anoi, anof, chave, token], expires=300)
    else:
        print(f"Tarefa processar_aba ***NAO*** disparada")
    
    return True

# @shared_task(name="backend.despachante.consome_progresso")
# def consome_progresso(nome_fila):
#     redis = RedisConnector()
#     while True:
#         print(f'Aguardando mensagem da fila {nome_fila}')
#         mensagem = redis.pop(nome_fila)
#         if mensagem:
#             _, valor = mensagem
#             chave = valor
#             redis.incr(chave)

#             print(f"Chave {chave}: Incrementado")

#@app_celery_despachante.task
#@shared_task(name="backend.despachante.consome_tarefas")




# consome_progresso.delay(settings.FILA_PROGRESSO_BAIXAR_CURRICULOS)
# consome_progresso.delay(settings.FILA_PROGRESSO_PROCESSAR_CURRICULOS)
# consome_tarefas.delay(settings.FILA_TAREFA_BAIXAR_CURRICULOS)
# consome_tarefas.delay(settings.FILA_TAREFA_PROCESSAR_CURRICULOS)