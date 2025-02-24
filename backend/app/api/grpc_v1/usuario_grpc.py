from __future__ import print_function

# from backend.worker.queries import *
from backend.db.cache import RedisConnector
from protos.out import messages_pb2, usuarios_pb2_grpc
from backend.worker.task_users import tarefa_autentica_usuario, tarefa_verifica_usuario, tarefa_retorna_lista_usuarios
from backend.worker.crud.crud_user import user
from google.protobuf.json_format import ParseDict, MessageToDict
from backend.core.security import generate_jwt_token, decode_jwt_token, ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME
import uuid

# Implementação do serviço gRPC
class Usuario(usuarios_pb2_grpc.UsuarioServicer):

    def Login(self, request, context) -> messages_pb2.LoginResponse:
        print('Login chamada...')
        try:
            user, useravatar = tarefa_autentica_usuario.apply(kwargs={'username':request.username , 'password':request.password}).get()

            if not user:
                raise
            elif not user.is_active:
                raise 
            usuario = messages_pb2.UsuarioDados(
                id_lattes=user.idlattes,
                email=user.email,
                nome=user.full_name,
                is_superuser=user.is_superuser,
                is_admin=user.is_admin,
                id_ies=user.id_ies,
                nome_ies=user.nome_ies,
                sigla_ies=user.sigla_ies,
                link_avatar=useravatar,
            )
            access_token = generate_jwt_token(MessageToDict(usuario), time=ACCESS_TOKEN_EXPIRATION_TIME)
            refresh_token = generate_jwt_token(
                {"id_lattes": usuario.id_lattes, "token_id": str(uuid.uuid4())}, 
                time=REFRESH_TOKEN_EXPIRATION_TIME
            )
            
            redis = RedisConnector()
            redis.setJson(
                f"user:{usuario.id_lattes}", 
                {"refresh_token": refresh_token, "user": MessageToDict(usuario)}, 
                60 * 60 * 24
            )

            loginResponse = messages_pb2.LoginResponse(
                usuario=usuario, 
                erro=False, 
                access_token=access_token, 
                refresh_token=refresh_token
            )

            return loginResponse

        except Exception as e:
            print(e)
            loginResponse = messages_pb2.LoginResponse()
            loginResponse.erro = True
            return loginResponse

    def ObtemUsuario(self, request, context) -> messages_pb2.UsuarioResponse:
        print('ObtemUsuario chamada...')
        try:
            usuario = tarefa_verifica_usuario.apply(kwargs={'email':request.email}).get()
            if usuario:
                
                dados_usuarios = {
                    "idLattes": usuario.idlattes,
                    "email": usuario.email,
                    "nome": usuario.full_name,
                    "isSuperuser": usuario.is_superuser,
                    "isAdmin": usuario.is_admin,
                    "idIes": usuario.id_ies,
                    "nomeIes": usuario.nome_ies,
                    "siglaIes": usuario.sigla_ies
                }
                usuarioResponse = messages_pb2.UsuarioResponse(usuario=ParseDict(dados_usuarios, messages_pb2.UsuarioDados()))
                
                return usuarioResponse
            
            return messages_pb2.UsuarioResponse()
        except Exception as e:
            print(e)
            return messages_pb2.UsuarioResponse()
    
    def VerificarSessao(self, request: messages_pb2.VerificarSessaoRequest, context):
        try:
            payload = decode_jwt_token(request.refresh_token)

            redis = RedisConnector()
            user_data = redis.getJson(f"user:{payload.get('id_lattes')}")

            stored_payload = decode_jwt_token(user_data["refresh_token"])

            if stored_payload["token_id"] != payload["token_id"]:
                redis.delete(f"user:{payload.get('id_lattes')}")  # Invalida a sessão
                raise Exception()
            
            new_access_token = generate_jwt_token(payload=user_data["user"], time=ACCESS_TOKEN_EXPIRATION_TIME)
            message = messages_pb2.VerificarSessaoResponse(access_token=new_access_token, erro=False)

            return message
        except:
            return messages_pb2.VerificarSessaoResponse(erro=True, access_token=None)

        
    # def ObtemListaUsuarios(self, request, context) -> messages_pb2.ListaUsuariosResponse:
    #     print('ObtemListaUsuarios chamada...')
    #     try:
    #         lista_usuarios = tarefa_retorna_lista_usuarios.apply(kwargs={
    #             'id_lattes':request.user.idLattes,
    #             'id_ies': request.user.idIes,
    #             'privilegio': request.user.isSuperuser
    #             }).get()
    #         lista_usuarios_response = messages_pb2.ListaUsuariosResponse()
    #         for usuario in lista_usuarios:
    #             dados_usuarios = {
    #                 "idLattes": usuario.idlattes,
    #                 "email": usuario.email,
    #                 "nome": usuario.full_name,
    #                 "isSuperuser": usuario.is_superuser,
    #                 "isAdmin": usuario.is_admin,
    #                 "idIes": usuario.id_ies,
    #                 "nomeIes": usuario.nome_ies,
    #                 "siglaIes": usuario.sigla_ies
    #             }
    #             usuario_response = messages_pb2.UsuarioResponse(user=ParseDict(dados_usuarios, messages_pb2.User()))
    #             lista_usuarios_response.item.append(usuario_response)
            
    #         return lista_usuarios_response
    #     except Exception as e:
    #         print(e)
    #         return messages_pb2.ListaUsuariosResponse()
        
    # def AtualizarUsuario(self, request, context) -> messages_pb2.AlteracaoUsuarioResponse:
    #     print('AtualizarUsuario chamada...')
    #     try:
    #         print("")
    #         # user.create()
    #         return messages_pb2.AlteracaoUsuarioResponse()
    #     except Exception as e:
    #         print(e)
    #         return messages_pb2.AlteracaoUsuarioResponse()
        
    # def CriarUsuario(self, request, context) -> messages_pb2.AlteracaoUsuarioResponse:
    #     print('CriarUsuario chamada...')
    #     try:
    #         status, menssagem = user.create(**MessageToDict(request.user))
    #         return messages_pb2.AlteracaoUsuarioResponse(status=status, menssagem=menssagem)
    #     except Exception as e:
    #         print(e)
    #         return messages_pb2.AlteracaoUsuarioResponse()
        
    # def DeletarUsuario(self, request, context) -> messages_pb2.AlteracaoUsuarioResponse:
    #     print('DeletarUsuario chamada...')
    #     try:
    #         status, menssagem = user.delete_user(request.user.idLattes)
    #         return messages_pb2.AlteracaoUsuarioResponse(status=status, menssagem=menssagem)
    #     except Exception as e:
    #         print(e)
    #         return messages_pb2.AlteracaoUsuarioResponse()
        
    # def AlternarStatusUsuario(self, request, context) -> messages_pb2.AlteracaoUsuarioResponse:
    #     print('DesativarUsuario chamada...')
    #     try:
    #         status, menssagem = user.alternar_usuario(request.user.idLattes)
    #         return messages_pb2.AlteracaoUsuarioResponse(status=status, menssagem=menssagem)
    #     except Exception as e:
    #         print(e)
    #         return messages_pb2.AlteracaoUsuarioResponse()
