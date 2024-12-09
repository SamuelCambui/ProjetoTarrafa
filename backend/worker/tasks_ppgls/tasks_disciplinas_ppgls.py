from protos.out.messages_pb2 import PPGLSJson
from google.protobuf.json_format import MessageToDict
import json
from backend.schemas.grafico import DadosGrafico, DataSet, Grafico
from backend.worker.crud.ppgls.queries.disciplinas_ppgls import queries_disciplinas
from backend.worker.celery_start_queries import app_celery_queries


@app_celery_queries.task
def get_disciplinas(
    id_grade: str,
    id_curso: str,
    id_ies: str,
):
    """
    Retorna todas as disciplinas de uma grade curricular de um curso.

    :param id_grade(str): Código da Grade Curricular.
    :param id_curso(str): Código do curso.
    :param id_ies(str): Código da Instituição.
    """
    try:
        disciplinas = queries_disciplinas.disciplinas_grade(
            id_grade=id_grade, id_ies=id_ies, id_curso=id_curso
        )
        message = PPGLSJson(
            nome="disciplinas",
            json=json.dumps([dict(disciplina) for disciplina in disciplinas]),
        )
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome="disciplinas", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_disciplina(id: int, id_ies: str):
    """
    Retorna uma disciplina em específico.

    :param id(int): Código da Disciplina.
    :param id_ies(int): Código da Instituição.
    """
    try:
        disciplina = queries_disciplinas.retorna_disciplina(id=id, id_ies=id_ies)
        message = PPGLSJson(nome="disciplinas", json=json.dumps(dict(disciplina)))
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="disciplinas", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_quantidade_prova_final(id_disc: str, id_ies: str, anoi: int, anof: int):
    """
    Retorna a quantidade de provas finais feitas em uma disciplina por período.\n
    Parâmetros:\n
        id(str): Código da disciplina.
        anoi(int): Ano inicial.
        anof(int): Ano Final.
    """
    try:
        quantidade = queries_disciplinas.quantidade_prova_final(
            id_disc=id_disc,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        dataset = DataSet()
        dados_grafico = DadosGrafico()
        dataset.label = "Quantidade de Provas Finais"

        dataset.data = [item["quantidade"] for item in quantidade]
        dados_grafico.labels = [
            "/".join([str(item["ano_letivo"]), str(item["semestre"])])
            for item in quantidade
        ]

        dados_grafico.datasets.append(dataset)

        grafico = Grafico()
        grafico.data = dados_grafico
        message = PPGLSJson(nome="graficoProvaFinal", json=json.dumps(grafico.to_dict()))
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome="graficoProvaFinal", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_quantidade_alunos_disciplina(id_disc: str, id_ies: str, anoi: str, anof: str):
    """
    Retorna a quantidade de alunos de uma disciplina por semestre em um período determinado.\n

    :param id(str): Código da disciplina.
    :param id_ies(str): Código da Universidade.
    :param anoi(int): Ano inicial.
    :param anof(int): Ano final.
    """
    try:
        alunos = queries_disciplinas.quantidade_alunos_por_semestre(
            id_disc=id_disc, id_ies=id_ies, anoi=anoi, anof=anof
        )

        message = PPGLSJson(
            nome="graficoQuantidadeAlunosDisciplina",
            json=json.dumps([dict(aluno) for aluno in alunos]),
        )
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome="graficoQuantidadeAlunosDisciplina", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_boxplot_notas_grade(
    id_curso: str,
    id_grade: str | None,
    id_ies: str,
    serie: int,
):
    try:
        disciplinas = queries_disciplinas.boxplot_notas_grade(
            id_curso=id_curso,
            id_grade=id_grade,
            id_ies=id_ies,
            serie=serie,
        )
        message = PPGLSJson(
            nome=f"boxplotNotasGradeSerie{serie}",
            json=json.dumps([dict(disciplina) for disciplina in disciplinas]),
        )
        return MessageToDict(message)
    except:
        message = PPGLSJson(nome=f"boxplotNotasGradeSerie{serie}", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_taxa_aprovacao_reprovacao_serie(
    id_curso: str,
    id_grade: str,
    id_ies: str,
    serie: int,
):
    try:
        aprovacoes_reprovacoes = queries_disciplinas.taxa_aprovacao_reprovacao_serie(
            id_curso=id_curso, id_ies=id_ies, serie=serie, id_grade=id_grade
        )
        message = PPGLSJson(
            nome=f"aprovacoesReprovacoesSerie{serie}",
            json=json.dumps([dict(ap) for ap in aprovacoes_reprovacoes]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome=f"aprovacoesReprovacoesSerie{serie}", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_aprovacoes_reprovacoes_por_semestre(
    id_disc: int,
    id_curso: str,
    id_ies: str,
    anoi: int,
    anof: int,
):
    """
    Retorna aprovações e reprovações de uma disciplina por semestre de um determinado período.\n

    :param id_disc(str): Código da disciplina.
    :param id_curso(str): Código do curso.
    :param id_ies(str): Código da universidade.
    :param anoi(int): Ano inicial.
    :param anof(int): Ano Final.
    """
    try:
        aprovacoes_reprovacoes = (
            queries_disciplinas.aprovacoes_reprovacoes_por_semestre(
                id_disc=id_disc,
                id_curso=id_curso,
                id_ies=id_ies,
                anoi=anoi,
                anof=anof,
            )
        )
        message = PPGLSJson(
            nome="aprovacoesReprovacoesDisciplina",
            json=json.dumps([dict(ap) for ap in aprovacoes_reprovacoes]),
        )
        return MessageToDict(message)
    except Exception as error:
        message = PPGLSJson(nome="aprovacoesReprovacoesDisciplina", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_boxplot_notas_disciplina(
    id_disc: int,
    id_ies: str,
    anoi: str,
    anof: str,
):
    try:
        notas = queries_disciplinas.boxplot_notas_disciplina(
            id_disc=id_disc,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = PPGLSJson(
            nome="boxplotNotasDisciplina",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="boxplotNotasDisciplina", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_histograma_notas_disciplina(
    id_disc: int,
    id_ies: str,
    anoi: str,
    anof: str,
):
    try:
        notas = queries_disciplinas.histograma_notas_disciplina(
            id_disc=id_disc,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = PPGLSJson(
            nome="histogramaNotasDisciplina",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="histogramaNotasDisciplina", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_evasao_disciplina(
    id_disc: str,
    id_curso: str,
    id_ies: str,
    anoi: int,
    anof: int,
):
    """
    Retorna a taxa de evasão e não evasão de uma disciplina por semestre.

    :param id_disc(str): Código da Disciplina
    :param id_curso(str): Código do Curso
    :param id_ies(str): Código da Instituição
    :param anoi(int): Ano Inicial
    :param anof(int): Ano Final
    """
    try:
        evasoes = queries_disciplinas.evasao_disciplina(
            id_disc=id_disc,
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = PPGLSJson(
            nome="evasaoDisciplina",
            json=json.dumps([dict(e) for e in evasoes]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="evasaoDisciplina", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_boxplot_notas_evasao(
    id_disc: str,
    id_curso: str,
    id_ies: str,
    anoi: int,
    anof: int,
):
    """
    Retorna as medidas do boxplot de notas para os alunos que evadiram de uma disciplina.

    :param id_disc(str): Código da Disciplina
    :param id_curso(str): Código do Curso
    :param id_ies(str): Código da Instituição
    :param anoi(int): Ano Inicial
    :param anof(int): Ano Final
    """
    try:
        notas = queries_disciplinas.boxplot_notas_evasao(
            id_disc=id_disc,
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = PPGLSJson(
            nome="boxplotEvasao",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="boxplotEvasao", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_boxplot_desempenho_alunos_professor(
    id_disc: str,
    id_ies: str,
    anoi: int,
    anof: int,
):
    """
    Retorna as medidas do boxplot de notas para cada professor em uma disciplina.
    Compara o desempenho dos alunos por cada professor em uma disciplina.

    :param id_disc(str): Código da Disciplina
    :param id_ies(str): Código da Instituição
    :param anoi(int): Ano Inicial
    :param anof(int): Ano Final
    """

    try:
        notas = queries_disciplinas.boxplot_desempenho_alunos_professor(
            id_disc=id_disc,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = PPGLSJson(
            nome="boxplotDesempenhoProfessor",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="boxplotDesempenhoProfessor", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_boxplot_desempenho_cotistas(
    id_disc: str,
    id_ies: str,
):
    """
    Retorna as medidas do boxplot para alunos cotistas e não cotistas.

    :param id_disc(str): Código da Disciplina
    :param id_ies(str): Código da Instituição
    """
    try:
        notas = queries_disciplinas.boxplot_desempenho_cotistas(
            id_disc=id_disc,
            id_ies=id_ies,
        )

        message = PPGLSJson(
            nome="boxplotDesempenhoCotistas",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="boxplotDesempenhoCotistas", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_histograma_desempenho_cotistas(
    id_disc: str,
    id_ies: str,
):
    """
    Retorna os dados para montagem do histograma de cotistas e não cotistas.

    :param id_disc(str): Código da Disciplina
    :param id_ies(str): Código da Instituição
    """
    try:
        notas = queries_disciplinas.histograma_desempenho_cotistas(
            id_disc=id_disc,
            id_ies=id_ies,
        )

        message = PPGLSJson(
            nome="histogramaDesempenhoCotistas",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = PPGLSJson(nome="histogramaDesempenhoCotistas", json=None)
        return MessageToDict(message)
