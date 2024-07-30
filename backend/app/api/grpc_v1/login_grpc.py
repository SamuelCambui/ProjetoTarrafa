from __future__ import print_function

import json

import sys
from pathlib import Path
import time


# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))

from celery import group
from backend.worker.queries import *

from backend.app import crud
from backend import schemas
from backend.core import deps
from backend.core import security

from protos.out import messages_pb2, usuario_pb2_grpc
from google.protobuf.json_format import Parse, MessageToJson, ParseDict

from backend.db.db import DBConnectorPPG


# Implementação do serviço gRPC
class Usuario(usuario_pb2_grpc.UsuarioServicer):

    async def ObtemUsuario(self, request, context):
        print('ObtemUsuario chamada...')
        try:
            db = DBConnectorPPG()
            user = await crud.user.verify_in_db(db, email = request.username)
            if user:
                usuarioResponse = messages_pb2.UsuarioResponse()
                usuarioResponse.idlattes = user.idlattes
                usuarioResponse.email = user.email
                usuarioResponse.full_name = user.full_name
                usuarioResponse.is_superuser = user.is_superuser
                usuarioResponse.is_admin = user.is_admin
                usuarioResponse.id_ies = user.id_ies
                
                return usuarioResponse
            
            return messages_pb2.UsuarioResponse()
        except Exception as e:
            print(e)
            return messages_pb2.UsuarioResponse()
        finally:
            db.close()
        

    async def Login(self, request, context):
        print('Login chamada...')
        try:
            db = DBConnectorPPG()
            userLogin = crud.user
            user, useravatar = await userLogin.authenticate(
                db, 
                password=request.password,
                email=request.username, 
            )
            if not user:
                raise
            elif not crud.user.is_active(user):
                raise 

            loginResponse = messages_pb2.LoginResponse()
            loginResponse.avatar = useravatar
            loginResponse.nome = user.full_name
            loginResponse.email  = user.email
            loginResponse.idlattes = user.idlattes
            loginResponse.erro = False

            return loginResponse

        except:
            loginResponse = messages_pb2.LoginResponse()
            loginResponse.erro = True
            return loginResponse
        
        finally:
            db.close()

        

    