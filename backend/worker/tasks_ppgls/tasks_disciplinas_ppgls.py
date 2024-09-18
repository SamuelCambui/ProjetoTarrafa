from protos.out import messages_pb2
from google.protobuf.json_format import MessageToDict
import json
import re

from backend.schemas.grafico import DadosGrafico, DataSet, Grafico
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
        retorno = messages_pb2.PPGLSJson(nome='lista_dados_disciplina', json=json.dumps(respostaDict))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

@app_celery_queries.task
def tarefa_lista_disciplinas_por_curso(id: str):
    """
    Retorna todas as disciplinas de um curso.

        Parâmetros:
            id(str): Código do curso. 
    """
    try:
        resposta = queries_disciplinas.retorna_disciplinas(id)
        retorno = messages_pb2.PPGLSJson(nome='lista_disciplinas_por_curso', json=json.dumps([dict(disciplina) for disciplina in resposta]))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

@app_celery_queries.task
def tarefa_quant_alunos_por_semestre(id: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos por semestre de um curso de pós-graduação latu sensu ao longo do tempo a partir de um ano inicial.

        Parâmetros:
            id(str): Código da disciplina.
            ano(int): Ano inicial.
    """
    try:
        respostaDict = queries_disciplinas.quant_alunos_por_semestre(id, anoi, anof)
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Quantidade de Alunos'
    

        dataset.data = ([float(item['quantidade']) for item in respostaDict])
        dados_grafico.labels = ['/'.join([str(item['ano_letivo']), str(item['semestre'])]) for item in respostaDict]
        
        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico
    

        retorno = messages_pb2.PPGLSJson(nome='quantidade_alunos_disciplina', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())



@app_celery_queries.task
def tarefa_reprovacoes_por_falta_por_semestre_curso(id: str, anoi: int, anof: int):
    """
    Retorna reprovações das disciplinas de um curso por falta por semestre de um determinado período.

        Parâmetros:
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
    
        respostaDict = queries_disciplinas.reprovacoes_por_falta_por_semestre_curso(id, anoi, anof)
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Reprovações por Falta'

        dataset.data = ([float(item['alunos_reprovados']) for item in respostaDict])
        dados_grafico.labels = ['/'.join([str(item['ano_letivo']), str(item['semestre'])]) for item in respostaDict]

        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico

        retorno = messages_pb2.PPGLSJson(nome='reprovacoes_por_falta_por_semestre_por_curso', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())



@app_celery_queries.task
def tarefa_aprovacoes_por_falta_por_semestre_curso(id: str, anoi: int, anof: int):
    """
    Retorna aprovações das disciplinas de um curso por falta por semestre de um determinado período.

        Parâmetros:
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    """
    try:
        respostaDict = queries_disciplinas.aprovacoes_por_falta_por_semestre_curso(id, anoi, anof)

        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Aprovações por Falta'

        dataset.data = ([float(item['alunos_aprovados']) for item in respostaDict])
        dados_grafico.labels = ['/'.join([str(item['ano_letivo']), str(item['semestre'])]) for item in respostaDict]
        
        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico

        retorno = messages_pb2.PPGLSJson(nome='aprovacoes_por_falta_por_semestre_por_curso', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())


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

        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Reprovações'

        dataset.data = ([float(item['alunos_reprovados']) for item in respostaDict])
        dados_grafico.labels = ['/'.join([str(item['ano_letivo']), str(item['semestre'])]) for item in respostaDict]
        
        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico

        retorno = messages_pb2.PPGLSJson(nome='reprovacoes_por_semestre', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())
    
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

        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Aprovações'

        dataset.data = ([float(item['alunos_aprovados']) for item in respostaDict])
        dados_grafico.labels = ['/'.join([str(item['ano_letivo']), str(item['semestre'])]) for item in respostaDict]
        
        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico

        retorno = messages_pb2.PPGLSJson(nome='aprovacoes_por_semestre', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())


@app_celery_queries.task
def tarefa_reprovacoes_por_serie(id: str, anoi: int, anof: int, serie: int):
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
        respostaDict = queries_disciplinas.reprovacoes_por_serie(id, anoi, anof, serie)
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Média de Reprovações'

        dataset.data = [float(item['round']) for item in respostaDict]
        dados_grafico.labels = [item['disciplina'] for item in respostaDict]

        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico

        retorno = messages_pb2.PPGLSJson(nome=f'graficoReprovacaoSerie{serie}', json=json.dumps(grafico.to_dict()))
        return MessageToDict(retorno)
    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())

@app_celery_queries.task
def tarefa_media_disciplinas_por_serie(id: str, anoi: str, anof: str, serie: int):
    """
    Retorna a média de todas as disciplinas de uma serie.\n
        Ex: Retorna a média de todas as disciplinas do 1º período do curso.\n
        Parâmetros:\n
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
    
    """
    try:
        
        medias = queries_disciplinas.media_disciplinas_por_serie(id=id, anoi=anoi, anof=anof, serie=serie)
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = 'Nota Média'

        dataset.data = [float(item['media']) for item in medias]
        dados_grafico.labels = [item['disciplina'] for item in medias]
        
        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico

        message = messages_pb2.PPGLSJson(nome=f'graficoMediasSerie{serie}', json=json.dumps(grafico.to_dict()))
        return MessageToDict(message)


    except Exception as e:
        print(e)
        return MessageToDict(messages_pb2.PPGLSJson())