from protos.out import messages_pb2
from google.protobuf.json_format import MessageToDict
from typing import Optional
from backend.schemas.user_form import Usuario, UsuarioFront

import json
from backend.worker.crud.ppgls.crud_user_form import user
from backend.worker.crud.ppgls.queries_formulario_ppgls import queries_formulario_ppgls
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def tarefa_inserir_formulario_ppgls(**kwargs: dict):
    """
    Tarefa para inserir um formulário no banco de dados de pós-graduação latu sensu.
    
    Parâmetros:
        kwargs (dict): Dicionário com os dados necessários para inserir o formulário.
    """
    try:
        print("Conteúdo de kwargs da task:", kwargs)
        # Chama a função de inserção do formulário passando os parâmetros.
        sucesso = queries_formulario_ppgls.inserir_formulario_ppgls(**kwargs)

        
        # Se a operação foi bem-sucedida (True), monta o JSON correspondente.
        resposta = {}
        if sucesso:
            resposta = {"status": True, "mensagem": "Formulário inserido com sucesso."}
        else:
            resposta = {"status": False, "mensagem": "Falha ao inserir o formulário."}
        
        # Cria a mensagem de resposta com o JSON gerado.
        retorno = messages_pb2.FormularioPPGLSJson(nome='inserir_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)
    
    except Exception as e:
        # Em caso de erro, retorna uma mensagem de erro.
        print(f"Erro ao inserir formulário: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Erro ao inserir o formulário: {str(e)}"
        }
        retorno = messages_pb2.FormularioPPGLSJson(nome='inserir_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)


    
 
@app_celery_queries.task
def tarefa_excluir_formulario_ppgls(nome_formulario:str , data_inicio:str):
    """
    Tarefa para excluir um formulário no banco de dados de pós-graduação latu sensu.

    """
    try:
        # Chama a função de exclusão do formulário passando os parâmetros.
        sucesso = queries_formulario_ppgls.excluir_formulario_ppgls(nome_formulario=nome_formulario, data_inicio=data_inicio)
        
        # Monta o JSON de retorno baseado no sucesso da operação.
        if sucesso:
            resposta = {
                "status": True,
                "mensagem": "Formulário excluído com sucesso."
            }
        else:
            resposta = {
                "status": False,
                "mensagem": "Falha ao excluir o formulário."
            }
        
        # Cria a mensagem de resposta com o JSON gerado.
        retorno = messages_pb2.FormularioPPGLSJson(nome='excluir_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)
    
    except Exception as e:
        # Em caso de erro, retorna uma mensagem de erro.
        print(f"Erro ao excluir formulário: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Erro ao excluir o formulário: {str(e)}"
        }
        retorno = messages_pb2.FormularioPPGLSJson(nome='excluir_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)

@app_celery_queries.task
def tarefa_buscar_formulario_ppgls(nome_formulario:str , data_inicio:str):
    """
    Tarefa para buscar os dados de um formulário de pós-graduação lato sensu.

    """
    try:

        # Verifica se os parâmetros obrigatórios foram fornecidos
        if not nome_formulario or not data_inicio:
            raise ValueError("Os parâmetros 'nome_formulario' e 'data_inicio' são obrigatórios.")

        # Chama a função de busca do formulário passando os parâmetros extraídos
        formulario_dados = queries_formulario_ppgls.buscar_formulario_ppgls(nome_formulario=nome_formulario, data_inicio=data_inicio)
        
        # Monta o JSON de retorno baseado no sucesso da operação.

        if formulario_dados:
            resposta = {
                "status": True,
                "mensagem": "Formulário encontrado com sucesso.",
                "dados": formulario_dados
            }
        else:
            resposta = {
                "status": False,
                "mensagem": "Falha ao buscar o formulário.",
                "dados": any
            }

        # Cria a mensagem de resposta com o JSON gerado
        retorno = messages_pb2.FormularioPPGLSJson(
            nome='buscar_formulario_ppgls', 
            json=json.dumps(resposta)
        )
        return MessageToDict(retorno)

    except Exception as e:
        # Em caso de erro, retorna uma mensagem de erro
        print(f"Erro ao buscar formulário: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Erro ao buscar o formulário: {str(e)}",
            "dados": None
        }
        retorno = messages_pb2.FormularioPPGLSJson(
            nome='buscar_formulario_ppgls', 
            json=json.dumps(resposta)
        )
        return MessageToDict(retorno)

# ---------------------LOGIN------------------------

@app_celery_queries.task
def tarefa_verifica_usuario(idlattes : str) -> Optional[UsuarioFront]:
    try:
        users = user.verifica_usuario(idlattes)
        if not users:
            raise

        return user
    except Exception as e:
        print(e)
        return None
  
@app_celery_queries.task
def tarefa_autentica_usuario(username : str, password : str) -> Optional[UsuarioFront]:
    try:   
        users, useravatar = user.autenticar_usuario(password=password, email=username)
        if not user:
            raise
        usuario_front = UsuarioFront(**users.model_dump())
        usuario_front.link_avatar = useravatar
            
        return usuario_front
    except Exception as e:
        print(e)
        return None

@app_celery_queries.task
def tarefa_retorna_lista_usuarios(is_admin : bool) -> list[Optional[Usuario]]:
    try:
        users = user.retorna_lista_usuario(is_admin)
        return users
    except Exception as e:
        print(e)
        return []





    




