from __future__ import print_function

# from backend.worker.queries import *
from protos.out import messages_pb2, usuarios_pb2_grpc
from backend.worker.task_users import tarefa_autentica_usuario, tarefa_verifica_usuario, tarefa_retorna_lista_usuarios
from backend.worker.crud.crud_user import user
from google.protobuf.json_format import ParseDict, MessageToDict
from backend.schemas.usuario import UsuarioCriacao, UsuarioAtualizacao


# Implementação do serviço gRPC
class Usuario(usuarios_pb2_grpc.UsuarioServicer):

    def Login(self, request, context) -> messages_pb2.LoginResponse:
        print('Login chamada...')
        try:
            usuario = tarefa_autentica_usuario.apply(kwargs={'username':request.username , 'password':request.password}).get()

            if not usuario or not usuario.is_active:
                raise
            
            loginResponse = messages_pb2.LoginResponse(usuario=ParseDict(usuario.dict(), messages_pb2.UsuarioDadosFront()), erro=False)

            return loginResponse

        except Exception as e:
            print(e)
            loginResponse = messages_pb2.LoginResponse(erro=True)
            return loginResponse

    def ObtemUsuario(self, request, context) -> messages_pb2.UsuarioResponse:
        print('ObtemUsuario chamada...')
        try:
            usuario = tarefa_verifica_usuario.apply(kwargs={'idlattes':request.id_lattes}).get()
            if usuario:
                usuarioResponse = messages_pb2.UsuarioResponse(usuario=ParseDict(usuario.dict(), messages_pb2.UsuarioDadosFront()))
                return usuarioResponse
            
            return messages_pb2.UsuarioResponse()
        except Exception as e:
            print(e)
            return messages_pb2.UsuarioResponse()
        
    def ObtemListaUsuarios(self, request, context) -> messages_pb2.ListaUsuariosResponse:
        print('ObtemListaUsuarios chamada...')
        try:
            lista_usuarios = tarefa_retorna_lista_usuarios.apply(kwargs={
                'id_lattes':request.usuario.id_lattes,
                'id_ies': request.usuario.id_ies,
                'privilegio': request.usuario.is_superuser
                }).get()
            lista_usuarios_response = messages_pb2.ListaUsuariosResponse()
            for usuario in lista_usuarios:
                usuario_response = messages_pb2.UsuarioResponse(usuario=ParseDict(usuario.dict(), messages_pb2.UsuarioDadosFront()))
                lista_usuarios_response.item.append(usuario_response)
            
            return lista_usuarios_response
        except Exception as e:
            print(e)
            return messages_pb2.ListaUsuariosResponse()
        
    def AtualizarUsuario(self, request, context) -> messages_pb2.AlteracaoUsuarioResponse:
        print('AtualizarUsuario chamada...')
        try:
            usuario_atualizado = UsuarioAtualizacao(**MessageToDict(request.usuario, preserving_proto_field_name=True), password=request.password)
            status, menssagem = user.atualizar_usuario(usuario_atualizado)
            return messages_pb2.AlteracaoUsuarioResponse(status=status, menssagem=menssagem)
        except Exception as e:
            print(e)
            return messages_pb2.AlteracaoUsuarioResponse()
        
    def CriarUsuario(self, request, context) -> messages_pb2.AlteracaoUsuarioResponse:
        print('CriarUsuario chamada...')
        try:
            novo_usuario = UsuarioCriacao(**MessageToDict(request.usuario, preserving_proto_field_name=True), password = request.password)
            status, menssagem = user.criacao_usuario(novo_usuario)
            return messages_pb2.AlteracaoUsuarioResponse(status=status, menssagem=menssagem)
        except Exception as e:
            print(e)
            return messages_pb2.AlteracaoUsuarioResponse()
        
    def DeletarUsuario(self, request, context) -> messages_pb2.AlteracaoUsuarioResponse:
        print('DeletarUsuario chamada...')
        try:
            status, menssagem = user.deletar_usuario(request.id_lattes)
            return messages_pb2.AlteracaoUsuarioResponse(status=status, menssagem=menssagem)
        except Exception as e:
            print(e)
            return messages_pb2.AlteracaoUsuarioResponse()
    
        
    def AlternarStatusUsuario(self, request, context) -> messages_pb2.AlteracaoUsuarioResponse:
        print('DesativarUsuario chamada...')
        try:
            status, menssagem = user.alternar_ativo_usuario(request.id_lattes)
            return messages_pb2.AlteracaoUsuarioResponse(status=status, menssagem=menssagem)
        except Exception as e:
            print(e)
            return messages_pb2.AlteracaoUsuarioResponse()
        
    def ObtemListaUniversidades(self, request, context) -> messages_pb2.ListaUniversidadesResponse:
        print('ObtemListaUniversidades chamada...')
        try:
            universidades = user.retorna_lista_universidades()
            lista_universidades = messages_pb2.ListaUniversidadesResponse()
            for universidade in universidades:
                universidade_response = messages_pb2.Universidade(**universidade)
                lista_universidades.item.append(universidade_response)
            return lista_universidades
        except Exception as e:
            print(e)
            return messages_pb2.ListaUniversidadesResponse()