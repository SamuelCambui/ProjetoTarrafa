import json
from backend.schemas.grafico import DadosGrafico, DataSet, Grafico
from protos.out.messages_pb2 import GradJson
from google.protobuf.json_format import MessageToDict
from backend.worker.crud.grad.queries_cursos import queries_cursos
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def get_cursos(id_ies: str):
    """
    Retorna todos os cursos de graduação(Bacharelado, Licenciatura).

    :param id_ies(str): Código da Instituição
    """
    try:
        cursos = queries_cursos.lista_cursos(id_ies=id_ies)
        message = GradJson(
            nome="cursos", json=json.dumps([dict(curso) for curso in cursos])
        )
        return MessageToDict(message)
    except Exception as error:
        message = GradJson(nome="cursos", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_curso(id_curso: str, id_ies: str):
    """
    Retorna dados de um curso em específico.

    :param id_curso(str): Código do Curso
    :param id_ies(str): Código da Instituição
    """
    try:
        curso = queries_cursos.retorna_curso(id=id_curso, id_ies=id_ies)
        message = GradJson(nome="dadosCurso", json=json.dumps(dict(curso)))
        return MessageToDict(message)
    except Exception as error:
        message = GradJson(nome="dadosCurso", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_egressos(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna a quantidade de egressos de um curso por semestre em determinado período.

    :param id_curso(str): Código do curso.
    :param id_ies(str): Código da Instituição.
    :param anoi(int): Ano inicial.
    :param anof(int): Ano final.
    """
    try:
        egressos = queries_cursos.egressos(
            id_curso=id_curso, id_ies=id_ies, anoi=anoi, anof=anof
        )

        message = GradJson(
            nome="graficoEgressos", json=json.dumps([dict(eg) for eg in egressos])
        )
        return MessageToDict(message)
    except Exception as error:
        message = GradJson(nome="graficoEgressos", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_quantidade_alunos_por_sexo(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos do sexo feminino e masculino, por semestre, de um curso.\n

    :param id(str): Código do curso.
    :param id_ies(str): Código da instituição.
    :param anoi(int): Ano inicial.
    :param anof(int): Ano final.
    """
    try:
        alunos = queries_cursos.quantidade_alunos_por_sexo(
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        message = GradJson(
            nome="graficoQuantidadeAlunosSexo",
            json=json.dumps([dict(aluno) for aluno in alunos]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = GradJson(nome="graficoQuantidadeAlunosSexo", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_forma_ingresso(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos ingressantes por cada modalidade de forma de ingresso.\n

    :param id(str): Código do curso.
    :param id_ies(str): Código da universidade.
    :param anoi(int): Ano inicial.
    :param anof(int): Ano final.
    """
    try:
        formas = queries_cursos.forma_ingresso(
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = GradJson(
            nome="graficoFormaIngresso",
            json=json.dumps([dict(forma) for forma in formas]),
        )
        return MessageToDict(message)
    except:
        message = GradJson(nome="graficoFormaIngresso", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_alunos_necessidade_especial(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna a necessidade especial e a quantidade de alunos que a tem, por curso. \n

    :param id(str): Código do curso.
    :param id_ies(str): Código da universidade.
    :param anoi(int): Ano inicial.
    :param anof(int): Ano final.
    """
    try:
        quantidade = queries_cursos.alunos_necessidade_especial(
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        message = GradJson(
            nome="graficoNecessidadeEspecial",
            json=json.dumps([dict(q) for q in quantidade]),
        )
        return MessageToDict(message)
    except:
        message = GradJson(nome="graficoNecessidadeEspecial", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_professores(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna os professores de um curso.\n

    :param id(str): Código do curso.
    :param id_ies(str): Código da universidade.
    :param anoi(int): Ano Inicial
    :param anof(int): Ano Final
    """
    try:
        professores = queries_cursos.professores(
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        message = GradJson(
            nome="professores",
            json=json.dumps([dict(professor) for professor in professores]),
        )
        return MessageToDict(message)
    except:
        message = GradJson(nome="professores", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_naturalidade_alunos(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna os municípios de nascimento dos alunos de um curso.\n

    :param id(str): Código do curso.
    :param id_ies(str): Código da universidade.
    :param anoi(int): Ano Inicial.
    :param anof(int): Ano Final.
    """
    try:
        municipios = queries_cursos.naturalidade_alunos(
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        message = GradJson(
            nome="municipios",
            json=json.dumps([dict(municipio) for municipio in municipios]),
        )
        return MessageToDict(message)
    except:
        message = GradJson(nome="municipios", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_tempo_formacao(id_curso: str, id_ies: str, anoi: int):
    """"""
    try:
        periodos = queries_cursos.tempo_formacao(
            id_curso=id_curso, id_ies=id_ies, anoi=anoi
        )

        message = GradJson(
            nome="graficoTempoFormacao",
            json=json.dumps([dict(periodo) for periodo in periodos]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = GradJson(nome="graficoTempoFormacao", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_boxplot_idade(id_curso: str, id_ies: str, anoi: int, anof: int):
    try:
        idades = queries_cursos.boxplot_idade(id_curso=id_curso, id_ies=id_ies, anoi=anoi, anof=anof)

        message = GradJson(
            nome="boxplotIdade",
            json=json.dumps([dict(idade) for idade in idades]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = GradJson(nome="boxplotIdade", json=None)
        return MessageToDict(message)
    
@app_celery_queries.task
def get_grades(id_curso: str, id_ies: str):
    try:
        grades = queries_cursos.grades(id_curso=id_curso, id_ies=id_ies)

        message = GradJson(
            nome="grades",
            json=json.dumps([dict(grade) for grade in grades]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = GradJson(nome="grades", json=None)
        return MessageToDict(message)
 
