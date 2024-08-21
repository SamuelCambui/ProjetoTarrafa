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