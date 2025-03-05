from __future__ import print_function

# from backend.worker.queries import *
from protos.out import messages_pb2, usuarios_form_pb2_grpc
from backend.worker.tasks_ppgls.tasks_formulario_ppgls import tarefa_autentica_usuario,tarefa_verifica_usuario, tarefa_retorna_lista_usuarios
from backend.worker.crud.ppgls.crud_user_form import user
from google.protobuf.json_format import ParseDict, MessageToDict
from backend.schemas.user_form import UsuarioCriacao, UsuarioAtualizacao


# Implementação do serviço gRPC
class UsuarioFormulario(usuarios_form_pb2_grpc.UsuarioServicer):


    def ObtemUsuario(self, request, context) -> messages_pb2.UsuarioFormularioResponse:
        print('ObtemUsuario chamada...')
        try:
            usuario = tarefa_verifica_usuario.apply(kwargs={'idlattes':request.id_lattes}).get()
            if usuario:
                usuarioResponse = messages_pb2.UsuarioFormularioResponse(usuario=ParseDict(usuario.dict(), messages_pb2.UsuarioDadosFront()))
                return usuarioResponse
            
            return messages_pb2.UsuarioFormularioResponse()
        except Exception as e:
            print(e)
            return messages_pb2.UsuarioFormularioResponse()
        
    def ObtemListaUsuarios(self, request, context) -> messages_pb2.ListaUsuariosFormularioResponse:
        print('ObtemListaUsuarios chamada...')
        try:
            lista_usuarios = tarefa_retorna_lista_usuarios.apply(kwargs={
                'is_admin': request.usuario.is_admin
                }).get()
            lista_usuarios_response = messages_pb2.ListaUsuariosFormularioResponse()
            for usuario in lista_usuarios:
                usuario_response = messages_pb2.UsuarioFormularioResponse(usuario=ParseDict(usuario.dict(), messages_pb2.UsuarioDadosFront()))
                lista_usuarios_response.item.append(usuario_response)
            
            return lista_usuarios_response
        except Exception as e:
            print(e)
            return messages_pb2.ListaUsuariosFormularioResponse()
        
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
        
  