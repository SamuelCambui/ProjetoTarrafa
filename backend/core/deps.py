from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError

from backend.app import crud
from backend import schemas
from backend.core import security
from backend.core.config import settings
from backend.db.db import DBConnector, DBConnectorGRAD, DBConnectorPPG
from backend.db.cache import RedisConnector

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_STR}/login/access-token")

def get_db():
    db = DBConnectorPPG()
    try:
        yield db #injeta o db e mantém ativo até que o método que recebeu termine
    finally:
        db.close()  #quando o método que receber o db termina, a conexão é fechada, liberando o recurso
    
def get_db_grad():
    db = DBConnectorGRAD()
    try:
        yield db
    finally:
        db.close()

async def get_redis():
    redis = RedisConnector()
    try:
        yield redis
    finally:
        redis.close()

async def get_token(
    redis: RedisConnector = Depends(get_redis), 
    token: str = Depends(reusable_oauth2)
):
    return token


async def get_current_user(
    db: DBConnector = Depends(get_db), 
    redis: RedisConnector = Depends(get_redis), 
    token: str = Depends(reusable_oauth2)
    ) -> schemas.User:
    """
    Retorna usuário atual
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = None
    if redis.isConnected():
        ret = redis.exists(f"usuario:{token}")
        if ret == 1:
            usert = redis.getall(f"usuario:{token}")
            user = schemas.User.from_redis_dict(usert)
    if not user:
        raise HTTPException(status_code=400, detail="Usuário não encontrado")
    return user

def get_current_active_user(
    current_user: schemas.User = Depends(get_current_user),
    ) -> schemas.User:
    """
    Retorna o usuário se ele for ativo
    """
    if not crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Usuário Inativo")
    return current_user

def get_current_active_superuser(
    current_user: schemas.User = Depends(get_current_user),
    ) -> schemas.User:
    """
    Retorna o usuário se ele for superusuário
    """
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="O usuário não possui esses privilégios"
        )
    return current_user

def get_current_active_admin(
    current_user: schemas.User = Depends(get_current_user),
    ) -> schemas.User:
    """
    Retorna o usuário se ele for administrador
    """
    if not crud.user.is_admin(current_user):
        raise HTTPException(
            status_code=400, detail="O usuário não possui esses privilégios"
        )
    return current_user

def get_current_privileges(
    current_user: schemas.User = Depends(get_current_user),
    )-> schemas.User:
    """
    Retorna o usuário se ele for superusuário ou administrador
    """
    if not crud.user.is_admin(current_user) and not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="O usuário não possui esses privilégios"
        )
    return current_user

def get_id_ies_consulta(current_user:schemas.User = Depends(get_current_user)):
    """
    Retorna o id_ies se o usuário não for superusuário. Caso ele seja retorna None.
    """
    if crud.user.is_superuser(current_user):
        return None
    return current_user.id_ies
