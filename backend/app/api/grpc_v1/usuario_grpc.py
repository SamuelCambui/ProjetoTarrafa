from __future__ import print_function

# from backend.worker.queries import *
from protos.out import messages_pb2, usuarios_pb2_grpc
from backend.worker.task_users import tarefa_autentica_usuario, tarefa_verifica_usuario, tarefa_retorna_lista_usuarios
from backend.worker.crud.crud_user import user
from google.protobuf.json_format import ParseDict, MessageToDict


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
            loginResponse = messages_pb2.LoginResponse(usuario=usuario, erro=False)

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
    
