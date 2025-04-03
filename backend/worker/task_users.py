from typing import Optional
from backend.schemas.usuario import Usuario, UsuarioFront

from .crud.crud_user import crud
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def tarefa_verifica_usuario(idlattes : str) -> Optional[UsuarioFront]:
    try:
        user = crud.user.verifica_usuario(idlattes)
        if not user:
            raise
        nome_ies, sigla_ies = crud.user.dados_complementares(user.id_ies)
        user.nome_ies = nome_ies
        user.sigla_ies = sigla_ies
        return user
    except Exception as e:
        print(e)
        return None
    
@app_celery_queries.task
def tarefa_autentica_usuario(username : str, password : str) -> Optional[UsuarioFront]:
    try:   
        user, useravatar = crud.user.autenticar_usuario(password=password, email=username)
        nome_ies, sigla_ies = crud.user.dados_complementares(user.id_ies)
        if not user:
            raise
        usuario_front = UsuarioFront(**user.model_dump())
        usuario_front.nome_ies = nome_ies
        usuario_front.sigla_ies = sigla_ies
        usuario_front.link_avatar = useravatar
            
        return usuario_front
    except Exception as e:
        print(e)
        return None
    
@app_celery_queries.task
def tarefa_retorna_lista_usuarios(privilegio : bool, idlattes : str, id_ies : str) -> list[Optional[Usuario]]:
    try:
        users = crud.user.retorna_lista_usuario(privilegio, idlattes, id_ies)
        return users
    except Exception as e:
        print(e)
        return []
@app_celery_queries.task
def tarefa_retorna_lista_universidades() -> list[Optional[dict]]:
    try:
        universidades = crud.user.retorna_lista_universidades()
        return universidades
    except Exception as e:
        print(e)
        return []


