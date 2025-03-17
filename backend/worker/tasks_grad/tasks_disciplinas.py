import json
from protos.out.messages_pb2 import GradJson
from google.protobuf.json_format import MessageToDict
from backend.worker.crud.grad.queries_disciplinas import queries_disciplinas
from backend.worker.celery_start_queries import app_celery_queries
import polars as pl
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd


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
        message = GradJson(
            nome="disciplinas",
            json=json.dumps([dict(disciplina) for disciplina in disciplinas]),
        )
        return MessageToDict(message)
    except:
        message = GradJson(nome="disciplinas", json=None)
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
        message = GradJson(nome="disciplinas", json=json.dumps(dict(disciplina)))
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="disciplinas", json=None)
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
        message = GradJson(nome="graficoProvaFinal", json=json.dumps([dict(r) for r in quantidade]))
        return MessageToDict(message)
    except:
        message = GradJson(nome="graficoProvaFinal", json=None)
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

        message = GradJson(
            nome="graficoQuantidadeAlunosDisciplina",
            json=json.dumps([dict(aluno) for aluno in alunos]),
        )
        return MessageToDict(message)
    except:
        message = GradJson(nome="graficoQuantidadeAlunosDisciplina", json=None)
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
        message = GradJson(
            nome=f"boxplotNotasGradeSerie{serie}",
            json=json.dumps([dict(disciplina) for disciplina in disciplinas]),
        )
        return MessageToDict(message)
    except:
        message = GradJson(nome=f"boxplotNotasGradeSerie{serie}", json=None)
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
        message = GradJson(
            nome=f"aprovacoesReprovacoesSerie{serie}",
            json=json.dumps([dict(ap) for ap in aprovacoes_reprovacoes]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome=f"aprovacoesReprovacoesSerie{serie}", json=None)
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
        message = GradJson(
            nome="aprovacoesReprovacoesDisciplina",
            json=json.dumps([dict(ap) for ap in aprovacoes_reprovacoes]),
        )
        return MessageToDict(message)
    except Exception as error:
        message = GradJson(nome="aprovacoesReprovacoesDisciplina", json=None)
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

        message = GradJson(
            nome="boxplotNotasDisciplina",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="boxplotNotasDisciplina", json=None)
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

        message = GradJson(
            nome="histogramaNotasDisciplina",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="histogramaNotasDisciplina", json=None)
        return MessageToDict(message)


@app_celery_queries.task
def get_boxplot_notas_prova_final(
    id_disc: str,
    id_ies: str,
    anoi: str,
    anof: str,
):
    try:
        notas = queries_disciplinas.boxplot_notas_prova_final(
            id_disc=id_disc,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = GradJson(
            nome="boxplotProvaFinalDisciplina",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="boxplotProvaFinalDisciplina", json=None)
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
        evasao = queries_disciplinas.evasao_disciplina(
            id_disc=id_disc,
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        message = GradJson(
            nome="evasaoDisciplina",
            json=json.dumps([dict(e) for e in evasao]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="evasaoDisciplina", json=None)
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

        message = GradJson(
            nome="boxplotEvasao",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="boxplotEvasao", json=None)
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

        message = GradJson(
            nome="boxplotDesempenhoProfessor",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="boxplotDesempenhoProfessor", json=None)
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

        message = GradJson(
            nome="boxplotDesempenhoCotistas",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="boxplotDesempenhoCotistas", json=None)
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

        message = GradJson(
            nome="histogramaDesempenhoCotistas",
            json=json.dumps([dict(nota) for nota in notas]),
        )
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="histogramaDesempenhoCotistas", json=None)
        return MessageToDict(message)

@app_celery_queries.task
def get_classificacao_disciplinas(
    id_curso: str, 
    id_ies: str, 
    id_grade: str | None, 
):
    try:
        disciplinas = queries_disciplinas.classificacao_disciplinas(
            id_curso=id_curso, 
            id_ies=id_ies, 
            id_grade=id_grade
        )

        df = pl.DataFrame([dict(disciplina) for disciplina in disciplinas])
        
        # Normalizador dos Dados
        scaler = StandardScaler()
        
        df_pandas = df.select(["primeiro_quartil", "segundo_quartil", "terceiro_quartil", "taxa_aprovacao", "media"]).to_pandas()

        # Dataframe normalizado
        df_scaled = pl.DataFrame(pd.DataFrame(scaler.fit_transform(df_pandas), columns=df_pandas.columns)).with_columns(
            pl.Series(name="cod_disc", values=df.select(["cod_disc"]).to_series()),
            pl.Series(name="nome", values=df.select(["nome"]).to_series()),
            pl.Series(name="abreviacao", values=df.select(["abreviacao"]).to_series()),
            pl.Series(name="serie", values=df.select(["serie"]).to_series()),
            pl.Series(name="count", values=df.select(["count"]).to_series()),
        )

        # Aplicação do K-Means
        xkmeans = KMeans(n_clusters=3).fit(
            df_scaled.select(["primeiro_quartil", "segundo_quartil", "terceiro_quartil", "taxa_aprovacao", "media"])\
            .to_pandas()
        )

        # Detecção de qual grupo é mais fácil e qual é mais difícil com base na média dos clusters
        # 
        # A análise é feita com base na média dos clusters onde o cluster com a menor média é considerado o mais difícil,
        # pois apresenta os menores valores das variáveis analisadas.
        media_clusters = pd.DataFrame(xkmeans.cluster_centers_).mean(axis=1).to_list()

        labels = [0, 1, 2]
        label_dificil = media_clusters.index(min(media_clusters))
        labels.remove(label_dificil)
        label_facil = media_clusters.index(max(media_clusters))
        labels.remove(label_facil)
        label_medio = labels[0]

        df_classificacao = pl.DataFrame(df_scaled).with_columns(
            pl.Series(name='cluster', values=xkmeans.labels_)
        )\
            .with_columns(
                pl.when(pl.col("cluster").eq(label_facil))
                    .then(pl.lit("Fácil"))
                .when(pl.col("cluster").eq(label_medio))
                    .then(pl.lit("Médio"))
                .when(pl.col("cluster").eq(label_dificil))
                    .then(pl.lit("Difícil"))
                .alias('cluster')
            )
        
        dict_df = df_classificacao.select(["cod_disc", "nome", "abreviacao", "serie", "count", "cluster"]).to_dicts()

        classification_dict = {
            "id": "Níveis",
            "children": [
                { 
                    "id": "Fácil", 
                    "children": [
                        {"id": f"({disc['abreviacao']}) {disc['nome']}", "parentId": "Fácil"} for disc in dict_df if disc["cluster"] == "Fácil"
                    ] 
                }, 
                { 
                    "id": "Médio", 
                    "children": [
                        {"id": f"({disc['abreviacao']}) {disc['nome']}", "parentId": "Médio"} for disc in dict_df if disc["cluster"] == "Médio"
                    ] 
                },  
                { 
                    "id": "Difícil", 
                    "children": [
                        {"id": f"({disc['abreviacao']}) {disc['nome']}", "parentId": "Difícil"} for disc in dict_df if disc["cluster"] == "Difícil"
                    ] 
                }, 
            ]
        }

        message = GradJson(nome="classificacaoDisciplinas", json=json.dumps(classification_dict))
        return MessageToDict(message)
    except Exception as err:
        message = GradJson(nome="classificacaoDisciplinas", json=None)
        return MessageToDict(message)
