from protos.out import messages_pb2
from google.protobuf.json_format import MessageToDict
import json
import re


from backend.worker.crud.ppgls.queries.disciplinas_ppgls import queries_disciplinas
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def tarefa_lista_dados_disciplina(id: str):
    """
    Retorna dados de uma disciplina em específico.

        Parâmetros:
            id(int): Código da disciplina. 
    """
    try:
        respostaDict = queries_disciplinas.retorna_disciplina(id)
        retorno = messages_pb2.PPGLSJason(nome='lista_dados_disciplina', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_lista_disciplinas_por_curso(id: str):
    """
    Retorna todas as disciplinas de um curso.

        Parâmetros:
            id(str): Código do curso. 
    """
    try:
        respostaDict = queries_disciplinas.retorna_disciplinas(id)
        retorno = messages_pb2.PPGLSJason(nome='lista_disciplinas_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_lista_series_por_curso(id: str):
    """
    Retorna todas as series de um curso.

        Parâmetros:
            id(str): Código do curso. 
    """
    try:
        respostaDict = queries_disciplinas.retorna_series(id)
        retorno = messages_pb2.PPGLSJason(nome='lista_series_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())


@app_celery_queries.task
def tarefa_quant_alunos_por_semestre(id: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos por semestre de um curso de pós-graduação latu sensu ao longo do tempo a partir de um ano inicial.

        Parâmetros:
            id(str): Código do curso.
            ano(int): Ano inicial.
    """
    try:
        respostaDict = queries_disciplinas.quant_alunos_por_semestre(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='quant_alunos_por_semestre', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_reprovacoes_por_semestre_curso(id: str, anoi: int, anof: int):
    """
    Retorna reprovações das disciplinas de um curso por semestre de um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
        respostaDict = queries_disciplinas.reprovacoes_por_semestre_curso(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='reprovacoes_por_semestre_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_reprovacoes_por_falta_por_semestre_curso(id: str, anoi: int, anof: int):
    """
    Retorna reprovações das disciplinas de um curso por falta por semestre de um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
        respostaDict = queries_disciplinas.reprovacoes_por_falta_por_semestre_curso(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='reprovacoes_por_falta_por_semestre_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_aprovacoes_por_semestre_curso(id: str, anoi: int, anof: int):
    """
    Retorna aprovações das disciplinas de um curso por semestre de um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
        respostaDict = queries_disciplinas.aprovacoes_por_semestre_curso(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='aprovacoes_por_semestre_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_aprovacoes_por_falta_por_semestre_curso(id: str, anoi: int, anof: int):
    """
    Retorna aprovações das disciplinas de um curso por falta por semestre de um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
        respostaDict = queries_disciplinas.aprovacoes_por_falta_por_semestre_curso(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='aprovacoes_por_falta_por_semestre_por_curso', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())


@app_celery_queries.task
def tarefa_reprovacoes_por_semestre(id: str, anoi: int, anof: int):
    """
    Retorna reprovações de uma disciplina por semestre de um determinado período.

        Parâmetros:
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
        respostaDict = queries_disciplinas.reprovacoes_por_semestre(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='reprovacoes_por_semestre', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())
    
@app_celery_queries.task
def tarefa_aprovacoes_por_semestre(id: str, anoi: int, anof: int):
    """
    Retorna aprovações de uma disciplina por semestre de um determinado período.

        Parâmetros:
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
        respostaDict = queries_disciplinas.aprovacoes_por_semestre(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='aprovacoes_por_semestre', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_nota_media_por_semestre(id: str, anoi: int, anof: int):
    """
    Retorna a média de notas de uma disciplina por semestre de um determinado período.
        
        Parâmetros:\n
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
        respostaDict = queries_disciplinas.nota_media_por_semestre(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='nota_media_por_semestre', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_reprovacoes_por_serie(id: str, anoi: int, anof: int):
    """
    Retorna a média de todas as disciplinas de uma serie em determinado período.\n
        Ex: Retorna a média de reprovações de todas as disciplinas do 1º período do curso entre 2022 e 2024.\n
        Parâmetros:\n
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
            serie(int): Série desejada.
    """
    try:
        respostaDict = queries_disciplinas.reprovacoes_por_serie(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='reprovacoes_por_serie', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())

@app_celery_queries.task
def tarefa_media_disciplinas_por_serie(id: str, anoi: int, anof: int):
    """
    Retorna a média de todas as disciplinas de uma serie.\n
        Ex: Retorna a média de todas as disciplinas do 1º período do curso.\n
        Parâmetros:\n
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
            serie(int): Série desejada.
    """
    try:
        respostaDict = queries_disciplinas.media_disciplinas_por_serie(id, anoi, anof)
        retorno = messages_pb2.PPGLSJason(nome='media_disciplinas_por_serie', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJason())