from google.protobuf.json_format import MessageToDict
import json
from protos.out.messages_pb2 import PPGLSJson
from backend.worker.crud.ppgls.queries.queries_ppgls import queries_ppgls
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def get_naturalidade_alunos(id_ies: str, anoi: int, anof: int):
    """
    Retorna os municípios de nascimento dos alunos e quantidade de cada.
    """
    try:
        municipios = queries_ppgls.naturalidade_alunos(
            id_ies=id_ies, anoi=anoi, anof=anof
        )
        message = PPGLSJson(
            nome="municipios",
            json=json.dumps([dict(municipio) for municipio in municipios]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="municipios", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_quantidade_alunos_por_sexo(id_ies: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos do sexo masculino e feminino.
    """
    try:
        alunos = queries_ppgls.sexo_alunos(id_ies=id_ies, anoi=anoi, anof=anof)

        message = PPGLSJson(
            nome="graficoSexoAlunos", json=json.dumps([dict(aluno) for aluno in alunos])
        )
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome="graficoSexoAlunos", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_boxplot_idade(id_ies: str, anoi: int, anof: int):
    """
    Retorna as medidas do boxplot para a variável idade de todos os cursos de Graduação ou Licenciatura.

    :param id_ies(str): Código da Instituição.
    :param anoi(int): Ano Inicial.
    :param anof(int): Ano Final.
    """
    try:
        notas = queries_ppgls.boxplot_idade(
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = PPGLSJson(
            nome="boxplotIdade",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="boxplotIdade", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_taxa_matriculas(
    id_ies: str,
    anoi: int,
    anof: int,
):
    try:
        matriculas = queries_ppgls.taxa_matriculas(
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = PPGLSJson(
            nome="taxaMatriculas",
            json=json.dumps([dict(matricula) for matricula in matriculas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="taxaMatriculas", json=None)
        return MessageToDict(message)
 
@app_celery_queries.task
def get_taxa_matriculas_por_cota(
    id_ies: str,
    anoi: int,
    anof: int,
):
    try:
        matriculas = queries_ppgls.taxa_matriculas_por_cota(
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = PPGLSJson(
            nome="taxaMatriculasCota",
            json=json.dumps([dict(matricula) for matricula in matriculas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="taxaMatriculasCota", json=None)
        return MessageToDict(message)
