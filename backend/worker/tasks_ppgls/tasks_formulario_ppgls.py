from protos.out import messages_pb2
from google.protobuf.json_format import MessageToDict
import json



from backend.worker.crud.ppgls.queries_ppgls import queries_PPGLS
from backend.worker.celery_start_queries import app_celery_queries



@app_celery_queries.task
def tarefa_inserir_formulario_ppgls(kwargs: dict):
    """
    Tarefa para inserir um formulário no banco de dados de pós-graduação latu sensu.
    
    Parâmetros:
        kwargs (dict): Dicionário com os dados necessários para inserir o formulário.
    """
    try:
        # Chama a função de inserção do formulário passando os parâmetros.
        sucesso = queries_PPGLS.inserir_formulario_ppgls(**kwargs)
        
        # Se a operação foi bem-sucedida (True), monta o JSON correspondente.
        if sucesso:
            resposta = {
                "status": True,
                "mensagem": "Formulário inserido com sucesso."
            }
        else:
            resposta = {
                "status": False,
                "mensagem": "Falha ao inserir o formulário."
            }
        
        # Cria a mensagem de resposta com o JSON gerado.
      
        retorno = messages_pb2.FormularioPPGLSJason(nome='inserir_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)
    
    except Exception as e:
        # Em caso de erro, retorna uma mensagem de erro.
        print(f"Erro ao inserir formulário: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Erro ao inserir o formulário: {str(e)}"
        }
        retorno = messages_pb2.FormularioPPGLSJason(nome='inserir_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)

@app_celery_queries.task
def tarefa_excluir_formulario_ppgls(kwargs: dict):
    """
    Tarefa para excluir um formulário no banco de dados de pós-graduação latu sensu.
    
    Parâmetros:
        kwargs (dict): Dicionário com os dados necessários para excluir o formulário.
    """
    try:
        # Chama a função de exclusão do formulário passando os parâmetros.
        sucesso = queries_PPGLS.excluir_formulario_ppgls(**kwargs)
        
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
        retorno = messages_pb2.FormularioPPGLSJason(nome='excluir_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)
    
    except Exception as e:
        # Em caso de erro, retorna uma mensagem de erro.
        print(f"Erro ao excluir formulário: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Erro ao excluir o formulário: {str(e)}"
        }
        retorno = messages_pb2.FormularioPPGLSJason(nome='excluir_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)

@app_celery_queries.task
def tarefa_alterar_formulario_ppgls(kwargs: dict):
    """
    Tarefa para alterar um formulário no banco de dados de pós-graduação latu sensu.
    
    Parâmetros:
        kwargs (dict): Dicionário com os dados necessários para alterar o formulário.
    """
    try:
        # Chama a função de alteração do formulário passando os parâmetros.
        sucesso = queries_PPGLS.alterar_formulario_ppgls(**kwargs)
        
        # Monta o JSON de retorno baseado no sucesso da operação.
        if sucesso:
            resposta = {
                "status": True,
                "mensagem": "Formulário alterado com sucesso."
            }
        else:
            resposta = {
                "status": False,
                "mensagem": "Falha ao alterar o formulário."
            }
        
        # Cria a mensagem de resposta com o JSON gerado.
        retorno = messages_pb2.FormularioPPGLSJason(nome='alterar_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)
    
    except Exception as e:
        # Em caso de erro, retorna uma mensagem de erro.
        print(f"Erro ao alterar formulário: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Erro ao alterar o formulário: {str(e)}"
        }
        retorno = messages_pb2.FormularioPPGLSJason(nome='alterar_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)
    

@app_celery_queries.task
def tarefa_buscar_formulario_ppgls(kwargs: dict):
    """
    Tarefa para buscar os dados de um formulário de pós-graduação latu sensu.
    
    Parâmetros:
        kwargs (dict): Dicionário com os dados necessários para buscar o formulário.
    """
    try:
        # Chama a função de busca do formulário passando os parâmetros.
        formulario_dados = queries_PPGLS.buscar_formulario_ppgls(**kwargs)
        
        # Monta o JSON de retorno com os dados do formulário, coordenador e professores.
        resposta = {
            "status": True,
            "mensagem": "Formulário encontrado com sucesso.",
            "dados": formulario_dados
        }
        
        # Cria a mensagem de resposta com o JSON gerado.
        retorno = messages_pb2.FormularioPPGLSJason(nome='buscar_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)
    
    except Exception as e:
        # Em caso de erro, retorna uma mensagem de erro.
        print(f"Erro ao buscar formulário: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Erro ao buscar o formulário: {str(e)}",
            "dados": None
        }
        retorno = messages_pb2.FormularioPPGLSJason(nome='buscar_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)


