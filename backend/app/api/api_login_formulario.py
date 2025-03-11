from __future__ import print_function
from backend.db.cache import RedisConnector
from backend.worker.tasks_ppgls.tasks_formulario_ppgls import tarefa_autentica_usuario, tarefa_verifica_usuario, tarefa_autentica_usuario, tarefa_verifica_usuario, tarefa_retorna_lista_usuarios
from backend.core.security import generate_jwt_token, decode_jwt_token, ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME
from backend.schemas.user_form import UsuarioCriacao, UsuarioAtualizacao
from backend.worker.crud.ppgls.crud_user_form import user
import uuid
from typing import List, Optional

from fastapi import FastAPI,  HTTPException, Depends
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
        access_token = generate_jwt_token(user.model_dump(), time=ACCESS_TOKEN_EXPIRATION_TIME)
        refresh_token = generate_jwt_token(
            {"id_lattes": user.id_lattes, "token_id": str(uuid.uuid4())}, 
            time=REFRESH_TOKEN_EXPIRATION_TIME
        )
        
        redis = RedisConnector()
        redis.setJson(
            f"user:{user.id_lattes}", 
            {"refresh_token": refresh_token, "user": user.model_dump()}, 
            60 * 60 * 24
        )

        loginResponse = {
            "usuario" : user, 
            "erro" : False, 
            "access_token" : access_token, 
            "refresh_token" : refresh_token 
            }

        return loginResponse

    except Exception as e:
        print(e)
        return {
            "usuario" : None, 
            "erro" : True, 
            "access_token" : None, 
            "refresh_token" : None 
            }

    
@app.post("/verificar_token")
def VerificarSessao(token : Token):
    try:
        payload = decode_jwt_token(token.refresh_token)

        redis = RedisConnector()
        user_data = redis.getJson(f"user:{payload.get('id_lattes')}")

        stored_payload = decode_jwt_token(user_data["refresh_token"])

        if stored_payload["token_id"] != payload["token_id"]:
            redis.delete(f"user:{payload.get('id_lattes')}")  # Invalida a sessão
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
    

@app.get("/usuario/{id_lattes}")
def obter_usuario(id_lattes: str):
    try:
        usuario = tarefa_verifica_usuario.apply(kwargs={"idlattes": id_lattes}).get()
        if usuario:
            return usuario.dict()
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/usuarios", response_model=List[dict])
def obter_lista_usuarios(is_admin: bool):
    try:
        lista_usuarios = tarefa_retorna_lista_usuarios.apply(kwargs={"is_admin": is_admin}).get()
        return [usuario.dict() for usuario in lista_usuarios]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.put("/usuario/{id_lattes}")
def atualizar_usuario(id_lattes: str, usuario_atualizado: UsuarioAtualizacao):
    try:
        status, mensagem = user.atualizar_usuario(usuario_atualizado)
        return {"status": status, "mensagem": mensagem}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/usuario")
def criar_usuario(novo_usuario: UsuarioCriacao):
    try:
        status, mensagem = user.criacao_usuario(novo_usuario)
        return {"status": status, "mensagem": mensagem}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/usuario/{id_lattes}")
def deletar_usuario(id_lattes: str):
    try:
        status, mensagem = user.deletar_usuario(id_lattes)
        return {"status": status, "mensagem": mensagem}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/usuario/{id_lattes}/alternar-status")
def alternar_status_usuario(id_lattes: str):
    try:
        status, mensagem = user.alternar_ativo_usuario(id_lattes)
        return {"status": status, "mensagem": mensagem}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
