import json
from google.protobuf.json_format import MessageToDict

from .crud.crud_user import crud
from backend.worker.celery_start_queries import app_celery_queries
from protos.out import messages_pb2

@app_celery_queries.task
def tarefa_verifica_usuario(email : str):
    try:
        user = crud.user.verify_in_db(email = email)
        nome_ies, sigla_ies = crud.user.dados_complementares(user.id_ies)
        user.nome_ies = nome_ies
        user.sigla_ies = sigla_ies
        return user
    except Exception as e:
        print(e)
        return None
    
@app_celery_queries.task
def tarefa_autentica_usuario(username : str, password : str):
    try:   
        user, useravatar = crud.user.authenticate(password=password, email=username)     
        return user, useravatar
    except Exception as e:
        print(e)
        return None, None
    
@app_celery_queries.task
def tarefa_retorna_lista_usuarios(privilegio : bool, id_lattes : str, id_ies : str):
    try:
        users = crud.user.get_multi(privilegio, id_lattes, id_ies)
        return users
    except Exception as e:
        print(e)
        return None
