import json
from protos.out.messages_pb2 import GradJson
from google.protobuf.json_format import MessageToDict
from backend.worker.crud.grad.queries_grad import queries_grad
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def get_naturalidade_alunos(id_ies: str, anoi: int, anof: int):
    """
    Retorna os municípios de nascimento dos alunos e quantidade de cada.
    """
    try:
        municipios = queries_grad.naturalidade_alunos(
            id_ies=id_ies, anoi=anoi, anof=anof
        )
        message = GradJson(
            nome="municipios",
            json=json.dumps([dict(municipio) for municipio in municipios]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="municipios", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_sexo_alunos(id_ies: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos do sexo masculino e feminino.
    """
    try:
        alunos = queries_grad.sexo_alunos(id_ies=id_ies, anoi=anoi, anof=anof)

        message = GradJson(
            nome="graficoSexoAlunos", json=json.dumps([dict(aluno) for aluno in alunos])
        )
        return MessageToDict(message)
    except:
        message = GradJson(nome="graficoSexoAlunos", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_egressos(id_ies: str, anoi: int, anof: int):
    try:
        egressos = queries_grad.egressos(id_ies=id_ies, anoi=anoi, anof=anof)

        message = GradJson(
            nome="graficoEgressos", json=json.dumps([dict(e) for e in egressos])
        )
        return MessageToDict(message)
    except Exception as erro:
        message = GradJson(nome="graficoEgressos", json=None)
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
        notas = queries_grad.boxplot_idade(
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = GradJson(
            nome="boxplotIdade",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="boxplotIdade", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_taxa_matriculas(
    id_ies: str,
    anoi: int,
    anof: int,
):
    try:
        matriculas = queries_grad.taxa_matriculas(
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = GradJson(
            nome="taxaMatriculas",
            json=json.dumps([dict(matricula) for matricula in matriculas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="taxaMatriculas", json=None)
        return MessageToDict(message)