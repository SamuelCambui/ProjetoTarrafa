from typing import Any, Dict, Literal
from backend.db.db import DBConnector, DBConnectorGRAD, DBConnectorGRADForm
from backend.db.db import DBConnectorPPG
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import smtplib
from functools import wraps
import os

from backend.core.config import settings

path_login = "/api/dados"

def gerar_combinacoes_anos(ano1, ano2):
    if ano1 > ano2:
        ano1, ano2 = ano2, ano1  # Garantir que ano1 seja sempre o menor

    combinacoes = []
    for i in range(ano1, ano2 + 1):
        for j in range(i, ano2 + 1):
            combinacoes.append((i, j))
    
    return combinacoes

def calcula_indprod(id: str, artigos, db:DBConnector):
    qarea = """select pesos.* from pesos_indart_areas_avaliacao as pesos
                    inner join programas as p on p.nome_area_avaliacao = pesos.nome_area_avaliacao 
                    where p.codigo_programa = %(id)s"""
        
    area = db.fetch_one(qarea, id=id)
    indprodart = 0
    if area:
        indprodart = area['A1']*artigos['A1'] + area['A2']*artigos['A2'] + area['A3']*artigos['A3'] + area['A4']*artigos['A4'] + area['B1']*artigos['B1'] + area['B2']*artigos['B2'] + area['B3']*artigos['B3'] + area['B4']*artigos['B4']
    
    return indprodart, dict(area)

def calcula_indprod_extsup(id: str, artigos, db:DBConnector):
    qarea = """select pesos.* from pesos_indart_areas_avaliacao as pesos
                    inner join programas as p on p.nome_area_avaliacao = pesos.nome_area_avaliacao 
                    where p.codigo_programa = %(id)s"""
        
    area = db.fetch_one(qarea, id=id)
    indprodart = 0
    if area:
        indprodart = area['A1']*artigos['A1'] + area['A2']*artigos['A2'] + area['A3']*artigos['A3'] + area['A4']*artigos['A4']
    
    return indprodart, dict(area)

def retorna_programas_ppg(id_ies: str, db:DBConnector):
    query = """select codigo_programa, nome from programas where id_ies = %(id)s"""

    ppgs = {}

    rows = db.fetch_all(query, id=id_ies)
    for r in rows:
        ppgs[r['codigo_programa']] = r['nome'].upper()

    return ppgs

def send_email(email_to: str, subject_template: str = "", html_template: str = "", environment: Dict[str, Any] = {}) -> bool: 
    """
    Função responsável por enviar email para o usuário
    
    Argumentos:
        email_to: Email do usuário
        subjetct_template: Título do email
        html_template: Nome do template html que será enviado no email
        environment: Dados adiocinais que serão inserido no template html
        
    Retorno:
        True se o email foi enviado
        False se o email não foi enviado
    """
    #Template dos Emails
    dir = f'{os.path.dirname(__file__)}{settings.EMAIL_TEMPLATES_DIR}'
    all_html_templates = os.listdir(dir)
    index = all_html_templates.index(html_template)
    template = all_html_templates[index]
    
    #Texto HTML
    msg = MIMEMultipart('alternative')
    msg["From"] = settings.SMTP_USER
    msg["To"] = email_to
    msg["Subject"] = subject_template
    with open(f'{dir}{settings.BARRA}{template}', encoding='utf-8') as file:
        html = file.read()
    part = MIMEText(html.format(**environment), "html")
    msg.attach(part)
    
    #Imagem no HTML
    logo = open(f"{dir}{settings.BARRA}logo_tarrafa_text.png", "rb").read()
    msgImage = MIMEImage(logo, 'png')
    msgImage.add_header('Content-ID', '<logotarrafa>')
    msgImage.add_header('Contend-Disposition', 'inline', filename = 'Logo Tarrafa')
    msg.attach(msgImage)

    #Conexão com o servidor do gmail e envio do email
    try:
        server = None
        server = smtplib.SMTP_SSL("smtp.gmail.com")
        #server.connect('smtp.gmail.com:587')
        #server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(msg["From"], msg["To"], msg.as_string())
        server.quit()
        return True
    except Exception as err:
        return err
    
def InsertQuery(table_name : str, **kwargs):
    """
    Função responsável por criar um query de inserção no banco
    """
    user_data = {k : v for k, v in kwargs.items() if v != '' and v is not None}
    max = len(user_data) - 1
    insert_query = f"INSERT INTO {table_name} ("
    for i, key in enumerate(user_data.keys()):
        if i == max:
            insert_query+= f'{key}) '
        else:
            insert_query+= f'{key}, '
    insert_query += "VALUES ("
    for i, key in enumerate(user_data.keys()):
        if i == max:
            insert_query+= f'%({key})s)'
        else:
            insert_query+= f'%({key})s, '
    return insert_query

def UpdateQuery(table_name, identifier, **kwargs):
    """
    Função responsável por criar um query de update no banco
    """
    update_query = f"UPDATE {table_name} set "
    max = len(kwargs) - 1
    for i, k in enumerate(kwargs.keys()):
        if k == identifier:
            continue
        if i == max:
            update_query += f'{k} = %({k})s '
        else:
            update_query += f'{k} = %({k})s, '
    update_query += f'where {identifier} = %({identifier})s'
    return update_query

async def get_grafo_name(path):
    """
    Funções responsável por formatar o nome do grafo para inserir na tabela
    """
    split_path = path.split("/")
    list_grafo_name = split_path[8:9]
    if "sucupira" or "lattes" in split_path:
        list_grafo_name = split_path[7:9]
    return " ".join(list_grafo_name).title()

def tratamento_excecao(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as error:
            nome_funcao = func.__name__
            print(f"A exceção foi gerada na função: {nome_funcao}")
            print(f"Erro: {str(error)}")
            raise error
    return wrapper

def tratamento_excecao_com_db(tipo_banco):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                if 'db' not in kwargs:
                    db = tipo_banco()
                    kwargs['db'] = db
                else:
                    db = kwargs['db'] if kwargs['db'] is not None else tipo_banco()
                return func(*args, **kwargs)
            except Exception as error:
                nome_funcao = func.__name__
                print(f"A exceção foi gerada na função: {nome_funcao}")
                print(f"Erro: {str(error)}")
                raise error
            finally:
                db.close()
        return wrapper
    return decorator

def tratamento_excecao_db_ppg():
    return tratamento_excecao_com_db(tipo_banco=DBConnectorPPG)

def tratamento_excecao_db_grad_form():
    return tratamento_excecao_com_db(tipo_banco=DBConnectorGRADForm)

def tratamento_excecao_db_grad():
    return tratamento_excecao_com_db(tipo_banco=DBConnectorGRAD)