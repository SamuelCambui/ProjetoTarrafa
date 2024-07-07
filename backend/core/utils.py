from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from datetime import date, datetime
from backend.db.db import DBConnector


from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import smtplib
import os
from jose import jwt

from backend.core.config import settings

path_login = "/api/dados"

programas_prp = {"32014015006P0": "BIODIVERSIDADE E USO DOS RECURSOS NATURAIS",
"32014015009P9": "BIOTECNOLOGIA",
"32014015102P9": "BOTÂNICA APLICADA",
"32014015004P7": "CIÊNCIAS DA SAÚDE",
"32014015003P0": "CUIDADO PRIMÁRIO EM SAÚDE",
"32014015101P2": "DESENVOLVIMENTO ECONÔMICO E ESTRATÉGIA EMPRESARIAL",
"32014015002P4": "DESENVOLVIMENTO SOCIAL",
"32014015103P5": "EDUCAÇÃO",
"32014015011P3": "GEOGRAFIA",
"32014015008P2": "HISTORIA",
"32014015007P6": "LETRAS-ESTUDOS LITERÁRIOS",
"32014015010P7": "MODELAGEM COMPUTACIONAL E SISTEMAS",
"32014015001P8": "PRODUÇÃO VEGETAL NO SEMIÁRIDO",
"32014015005P3": "ZOOTECNIA"}

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

def send_reset_password_email(email_to: str, username : str, token: str) -> bool:
    """
    Função responsável por enviar email de recuperação de senha para o usuário
    
    Argumentos:
        email_to: Email do usuário
        username: Nome do usuário
        token: Token criado para fazer a alteração da senha
        
    Retorno:
        True se o email foi enviado
        False se o email não foi enviado
    """
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Recuperação de Senha para o usuário {username}"
    server_host = settings.BACKEND_REAL
    link = f"{server_host}{settings.API_STR}/validate-reset-password-token?token={token}&email={email_to}"
    return send_email(
        email_to=email_to,
        subject_template=subject,
        html_template='recoverpassword.html',
        environment={
        "username": username,
        "link": link
        },
    )


def send_new_account_email(email_to: str, username: str, password: str) -> bool:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Criação de nova conta para {username}"
    server_host = settings.BACKEND_HOST
    pass
    #send_email(
    #    email_to=email_to,
    #    subject_template=subject,
    #    html_template="email_firstacess.html",
    #    environment={
    #        "project_name": settings.PROJECT_NAME,
    #        "username": username,
    #        "password": password,
    #        "email": email_to,
    #        #"link": link,
    #    },
    #)

def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email}, settings.SECRET_KEY, algorithm="HS256",
    )
    return encoded_jwt

def verify_password_reset_token(token: str) -> Optional[str]:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return decoded_token['sub']
    except jwt.JWTError:
        return None
    
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

async def get_actual_time():
    """
    Função responsável por retorna a hora e a data atuais
    """
    current_hours = datetime.now().strftime("%H:%M:%S") 
    current_date = date.today().strftime("%d/%m/%Y")
    return current_hours, current_date

async def time_log_acessos():
    """
    Função responsável por retornar o um dicionário para inserir na tabela log_acessos
    """
    current_time, current_date = await get_actual_time()
    return {'access_time':current_time, 'date':current_date}

async def time_log_erros():
    """
    Função responsável por retornar o um dicionário para inserir na tabela log_erros
    """
    current_time, current_date = await get_actual_time()
    return {'time_error':current_time, 'date_error':current_date}

async def log_acessos(db:DBConnector, table_name:str, **kwargs):
    """ 
    Inserindo dados na tabela log_acessos
    """
    time = await time_log_acessos()
    kwargs.update(time)
    query = InsertQuery(table_name, **kwargs)
    return db.insert(query, **kwargs)

async def log_grafos(db:DBConnector, table_name:str, **kwargs):
    """
    Inserindo dados na table log_grafos
    """
    time = await time_log_acessos()
    kwargs.update(time)
    if not 'grafo_name' in kwargs.keys():
        grafo_name = await get_grafo_name(kwargs['path'])
        kwargs.pop("path")
        kwargs.update({'grafo_name':grafo_name})
    query = InsertQuery(table_name, **kwargs)
    return db.insert(query, **kwargs)

async def get_grafo_name(path):
    """
    Funções responsável por formatar o nome do grafo para inserir na tabela
    """
    split_path = path.split("/")
    list_grafo_name = split_path[8:9]
    if "sucupira" or "lattes" in split_path:
        list_grafo_name = split_path[7:9]
    return " ".join(list_grafo_name).title()

async def list_traceback_functions(traceback_functions):
    """
    Função responsável por formatar o arquivo, linha e a causa da função que deu erro.
    """
    errs = traceback_functions.strip().split("File")
    init_error = errs[-1].split(',')
    file_error, line_error, unformat_error = init_error[0:3]
    line_error = int(line_error.replace("line", "").strip())
    unformat_error = unformat_error.replace("^", "").replace("\n", "").split()
    cause_error = " ".join(unformat_error)
    file_error = file_error.strip()[1:-1].split("\\")[-1]
    return {'line_error':line_error, 'file_error':file_error, 'cause_error':cause_error}

async def log_erros(db: DBConnector, **kwargs):
    """
    Inserir dados na tabela log_erros
    """
    error = await list_traceback_functions(kwargs['traceback'])
    time = await time_log_erros()
    kwargs.pop('traceback')
    kwargs.update(time)
    kwargs.update(error)
    query = InsertQuery("log_erros", **kwargs)
    return db.insert(query, **kwargs)

async def estatisticas(**kwargs):
    """
    Função responsável por inserir dos dados do usuário na chave estatísticas existente no redis
    """
    redis = kwargs['redis']
    user = kwargs['current_user']
    path = kwargs['request'].url.path
    if not redis.existsField("Estatisticas", user.idlattes):
        return redis.setField("Estatisticas", user.idlattes, {"login":datetime.today().strftime("%d/%m/%Y | %H:%M:%S"), 'logout':None})
    else:
        est = redis.getField("Estatisticas", user.idlattes)
        if 'login' in path:
            est.update({"login":datetime.today().strftime("%d/%m/%Y | %H:%M:%S")})
        elif 'logout' in path:
            est.update({"logout":datetime.today().strftime("%d/%m/%Y | %H:%M:%S")})
        return redis.setField("Estatisticas", user.idlattes, est)
