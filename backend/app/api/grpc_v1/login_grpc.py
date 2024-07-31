from __future__ import print_function

from backend.worker.queries import *
from protos.out import messages_pb2, usuarios_pb2_grpc


# Implementação do serviço gRPC
class Usuario(usuarios_pb2_grpc.UsuarioServicer):

    async def ObtemUsuario(self, request, context):
        print('ObtemUsuario chamada...')
        try:
            user = tarefa_verifica_usuario.apply(kwargs={'username':request.username}).get()
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
        

    async def Login(self, request, context):
        print('Login chamada...')
        try:
            user, useravatar = tarefa_autentica_usuario.apply(kwargs={'username':request.username , 'password':request.password}).get()

            if not user:
                raise
            elif not user.is_active:
                raise 

            loginResponse = messages_pb2.LoginResponse()
            loginResponse.avatar = useravatar
            loginResponse.nome = user.full_name
            loginResponse.email  = user.email
            loginResponse.idlattes = user.idlattes
            loginResponse.erro = False

            return loginResponse

        except Exception as e:
            loginResponse = messages_pb2.LoginResponse()
            loginResponse.erro = True
            return loginResponse


        

    