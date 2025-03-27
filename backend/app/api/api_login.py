from __future__ import print_function

import sys
from pathlib import Path

diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))

from backend.db.cache import RedisConnector
from backend.worker.task_users import tarefa_autentica_usuario, tarefa_verifica_usuario
from backend.core.security import generate_jwt_token, decode_jwt_token, ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME
import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class UserLogin(BaseModel):
    username: str
    password: str
    
class Token(BaseModel):
    refresh_token: str

app = FastAPI(title = "Login")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.get("/")
def main():
    return {"message": "Hello"}

@app.post("/")
def Login(request : UserLogin) -> dict:
    print('Login chamada...')
    try:
        user = tarefa_autentica_usuario.apply(kwargs={'username':request.username , 'password':request.password}).get()

        if not user:
            raise
        elif not user.is_active:
            raise
        

        loginResponse = {
            "usuario" : user, 
            "erro" : False, 
        }

        return loginResponse

    except Exception as e:
        print(e)
        return {
            "usuario" : None, 
            "erro" : True, 
        }

@app.get("/obter_usuario")
def ObtemUsuario(idlattes : str) -> dict:
    print('ObtemUsuario chamada...')
    try:
        usuario = tarefa_verifica_usuario.apply(kwargs={'idlattes':idlattes}).get()
        if usuario:
            
            return usuario.model_dump()
        
        return {}
    except Exception as e:
        print(e)
        return {}
    
@app.post("/verificar_token")
def VerificarSessao(token : Token):
    try:
        payload = decode_jwt_token(token.refresh_token)

        redis = RedisConnector()
        user_data = redis.getJson(f"user:{payload.get('idlattes')}")

        stored_payload = decode_jwt_token(user_data["refresh_token"])

        if stored_payload["token_id"] != payload["token_id"]:
            redis.delete(f"user:{payload.get('idlattes')}")  # Invalida a sessão
            raise Exception()
        
        new_access_token = generate_jwt_token(payload=user_data["user"], time=ACCESS_TOKEN_EXPIRATION_TIME)

        return {
            "erro" : False, 
            "access_token" : new_access_token, 
        }
    except Exception as error:
        print(error)
        return {
            "erro" : True, 
            "access_token" : None, 
            }
