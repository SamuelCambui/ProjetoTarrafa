from protos.out import messages_pb2
from google.protobuf.json_format import MessageToDict
import json



from backend.worker.crud.ppgls.queries_formulario_ppgls import QueriesFormularioPPGLS
from backend.worker.celery_start_queries import app_celery_queries

@app_celery_queries.task
def tarefa_tarefa_buscar_registros_formulario_ppgls(masp : int, tipo : int):
    """
    Tarefa para buscar dados de um professor ou coordenador.

    Parâmetros:
        masp(int): Código MASP do professor.
        tipo(int): 2 = coordenador, 1 = professor.
    """
    # Log de entrada na função e parâmetros recebidos
    print(f"Entrando em tarefa_tarefa_buscar_registros_formulario_ppgls com masp={masp} e tipo={tipo}")
    try:
        # Log antes de chamar a função de busca
        print(f"Chamando busca_professor_coordenador_ppgls com masp={masp} e tipo={tipo}")
        resposta = QueriesFormularioPPGLS.busca_professor_coordenador_ppgls(masp, tipo)
        
        # Log do resultado da busca
        print(f"Resultado da busca: {resposta}")

        # Retorno da resposta como FormularioPPGLSJson
        retorno = messages_pb2.FormularioPPGLSJson(nome='_buscar_registros_formulario_ppgls', json=json.dumps(resposta))
        print(f"Retorno FormularioPPGLSJson: {retorno}")

        return MessageToDict(retorno)
    
    except Exception as e:
        # Log em caso de exceção
        print(f"Erro ao buscar registro de professor ou coordenador: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Registro de professor ou coordenador não encontrado: {str(e)}"
        }
        retorno = messages_pb2.FormularioPPGLSJson(nome='buscar_registros_formulario', json=json.dumps(resposta))
        print(f"Retorno de erro FormularioPPGLSJson: {retorno}")
        return MessageToDict(retorno)

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
        sucesso = QueriesFormularioPPGLS.inserir_formulario_ppgls(**kwargs)
        
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
def tarefa_alterar_formulario_ppgls(**kwargs: dict):
    """
    Tarefa para alterar um formulário no banco de dados de pós-graduação latu sensu.
    
    Parâmetros:
        kwargs (dict): Dicionário com os dados necessários para alterar o formulário.
    """
    try:
        # Chama a função de alteração do formulário passando os parâmetros.
        sucesso = QueriesFormularioPPGLS.alterar_formulario_ppgls(**kwargs)
        
        # Monta o JSON de retorno baseado no sucesso da operação.
        resposta = {}
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
        retorno = messages_pb2.FormularioPPGLSJson(nome='alterar_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)
    
    except Exception as e:
        # Em caso de erro, retorna uma mensagem de erro.
        print(f"Erro ao alterar formulário: {e}")
        resposta = {
            "status": False,
            "mensagem": f"Erro ao alterar o formulário: {str(e)}"
        }
        retorno = messages_pb2.FormularioPPGLSJson(nome='alterar_formulario_ppgls', json=json.dumps(resposta))
        return MessageToDict(retorno)

@app_celery_queries.task
def tarefa_excluir_formulario_ppgls(nome_formulario:str , data_inicio:str):
    """
    Tarefa para excluir um formulário no banco de dados de pós-graduação latu sensu.

    """
    try:
        # Chama a função de exclusão do formulário passando os parâmetros.
        sucesso = QueriesFormularioPPGLS.excluir_formulario_ppgls(nome_formulario=nome_formulario, data_inicio=data_inicio)
        
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
        formulario_dados = QueriesFormularioPPGLS.buscar_formulario_ppgls(nome_formulario=nome_formulario, data_inicio=data_inicio)

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



    



