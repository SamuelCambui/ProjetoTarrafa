from google.protobuf.json_format import MessageToDict
import json
from protos.out.messages_pb2 import PPGLSJson
from backend.worker.crud.ppgls.queries.queries_cursos_ppgls import queries_cursos
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def get_cursos(id_ies: str):
    """
    Retorna todos os cursos de pós graduação latu sensu.

    :param id_ies(str): Código da Instituição
    """
    try:
        cursos = queries_cursos.lista_cursos(id_ies=id_ies)
        message = PPGLSJson(
            nome="cursos", json=json.dumps([dict(curso) for curso in cursos])
        )
        return MessageToDict(message)
    except Exception as error:
        message = PPGLSJson(nome="cursos", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_curso(id_curso: str, id_ies: str):
    """
    Retorna dados de um curso em específico.

    :param id_curso(str): Código do Curso
    :param id_ies(str): Código da Instituição
    """
    try:
        curso = queries_cursos.retorna_curso(id_curso=id_curso, id_ies=id_ies)
        message = PPGLSJson(nome="dadosCurso", json=json.dumps(dict(curso)))
        return MessageToDict(message)
    except Exception as error:
        message = PPGLSJson(nome="dadosCurso", json=None)
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
        message = PPGLSJson(
            nome="graficoQuantidadeAlunosSexo",
            json=json.dumps([dict(aluno) for aluno in alunos]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = PPGLSJson(nome="graficoQuantidadeAlunosSexo", json=None)
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

        message = PPGLSJson(
            nome="graficoFormaIngresso",
            json=json.dumps([dict(forma) for forma in formas]),
        )
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome="graficoFormaIngresso", json=None)
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
        message = PPGLSJson(
            nome="graficoNecessidadeEspecial",
            json=json.dumps([dict(q) for q in quantidade]),
        )
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome="graficoNecessidadeEspecial", json=None)
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
        message = PPGLSJson(
            nome="professores",
            json=json.dumps([dict(professor) for professor in professores]),
        )
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome="professores", json=None)
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
        message = PPGLSJson(
            nome="municipios",
            json=json.dumps([dict(municipio) for municipio in municipios]),
        )
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome="municipios", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_quantidade_alunos_por_semestre(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos por semestre de um curso ao longo do tempo, a partir de um ano inicial.\n

    :param id_curso(str): Código do curso.
    :param id_ies(str): Código da instituição.
    :param anoi(int): Ano inicial.
    :param anof(int): Ano final.
    """
    try:
        quantidade = queries_cursos.quantidade_alunos_por_semestre(
            id=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        message = PPGLSJson(
            nome="graficoQuantidadeAlunosSemestre",
            json=json.dumps([dict(q) for q in quantidade]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = PPGLSJson(nome="graficoQuantidadeAlunosSemestre", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_boxplot_idade(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna as medidas do boxplot para a variável idade de todos os cursos de Graduação ou Licenciatura.

    :param id_curso(str): Código da do curso.
    :param id_ies(str): Código da Instituição.
    :param anoi(int): Ano Inicial.
    :param anof(int): Ano Final.

    """
    try:
        resultado = queries_cursos.boxplot_idade(
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        message = PPGLSJson(
            nome="graficoBoxplotIdade",
            json=json.dumps([dict(row) for row in resultado]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = PPGLSJson(nome="graficoBoxplotIdade", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_quant_alunos_por_cor_por_ano(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna a quantidade de alunos por cor de pele agrupada por ano.\n

    :param id_curso(str): Código do curso.
    :param id_ies(str): Código da instituição.
    :param anoi(int): Ano inicial.
    :param anof(int): Ano final.
    """
    try:
        resultado = queries_cursos.quant_alunos_por_cor_por_ano(
            id=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        message = PPGLSJson(
            nome="graficoQuantAlunosPorCorPorAno",
            json=json.dumps([dict(row) for row in resultado]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = PPGLSJson(nome="graficoQuantAlunosPorCorPorAno", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_quant_alunos_vieram_gradu_e_nao_vieram_por_curso(id_curso: str, id_ies: str, anoi: int, anof: int):
    """
    Task para retornar a quantidade de alunos que vieram de cursos de graduação e alunos que não vieram,
    agrupados por curso de graduação e ano de matrícula.

    :param id_curso(str): Código do curso de pós-graduação.
    :param id_ies(str): Código da instituição.
    :param anoi(int): Ano inicial do intervalo.
    :param anof(int): Ano final do intervalo.
    """
    try:
        resultado = queries_cursos.quant_alunos_vieram_gradu_e_nao_vieram_por_curso(
            id=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        message = PPGLSJson(
            nome="graficoQuantAlunosVieramGraduENaoVieramPorCurso",
            json=json.dumps(resultado),
        )
        return MessageToDict(message)
    except Exception as erro:
        print(erro)
        message = PPGLSJson(nome="graficoQuantAlunosVieramGraduENaoVieramPorCurso",json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_grades(id_curso: str, id_ies: str):
    try:
        grades = queries_cursos.grades(id_curso=id_curso, id_ies=id_ies)

        message = PPGLSJson(
            nome="grades",
            json=json.dumps([dict(grade) for grade in grades]),
        )
        return MessageToDict(message)
    except Exception as erro:
        message = PPGLSJson(nome="grades", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_taxa_matriculas(
    id_ies: str,
    anoi: int,
    anof: int,
):
    try:
        matriculas = queries_cursos.taxa_matriculas(
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
        matriculas = queries_cursos.taxa_matriculas_por_cota(
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




