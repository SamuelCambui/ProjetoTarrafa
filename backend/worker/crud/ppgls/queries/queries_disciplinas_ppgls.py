from backend.core.utils import tratamento_excecao_db_grad
from backend.db.db import DBConnectorGRAD


class QueriesDisciplinas:
    @tratamento_excecao_db_grad()
    def retorna_disciplina(self, id_disc: str, id_ies: str, db: DBConnectorGRAD = None):
        """
        Retorna uma disciplina em específico.

        Parâmetros:
            id(str): Código da disciplina.
            id_ies(str): Código da Universidade.
        """
        query = """
            SELECT 
                cod_disc, 
                dis.nome, 
                dis.abreviacao, 
                cast(carga_horaria as float),
                dep.nome as departamento
            FROM disciplinas AS dis 
            LEFT JOIN departamentos AS dep ON dep.id_dep = dis.id_dep AND dep.id_ies = dis.id_ies
            WHERE cod_disc = %(id_disc)s and dis.id_ies = %(id_ies)s
        """

        ret = db.fetch_one(query, id_disc=id_disc, id_ies=id_ies)
        print("Query")
        print(ret)
        return ret

    @tratamento_excecao_db_grad()
    def disciplinas_grade(
        self,
        id_curso: str,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna todas as disciplinas de um curso.

        :param id_curso(str): Código do curso.
        :param id_ies(str): Código da Universidade.
        """

        query = """
            SELECT 
                STRING_AGG(cod_disc, ',') AS cod_disc,
                MIN(nome) AS nome,  -- Usamos MIN para pegar um único valor de nome no grupo
                STRING_AGG(DISTINCT abreviacao, ',') AS abreviacao,
                STRING_AGG(DISTINCT CAST(carga_horaria AS VARCHAR), ',') AS carga_horaria,
                STRING_AGG(DISTINCT departamento, ',') AS departamento  -- Usamos DISTINCT para evitar repetições
            FROM (
                SELECT 
                    cod_disc, 
                    dis.nome, 
                    dis.abreviacao, 
                    CAST(carga_horaria AS float) AS carga_horaria,
                    dep.nome AS departamento,
                    -- Normaliza os nomes, removendo pontuação e convertendo para maiúsculas
                    UPPER(REGEXP_REPLACE(dis.nome, '[^A-Z0-9 ]', '', 'g')) AS nome_normalizado,
                    -- Usamos a função de similaridade para comparar os nomes
                    ROW_NUMBER() OVER (PARTITION BY UPPER(REGEXP_REPLACE(dis.nome, '[^A-Z0-9 ]', '', 'g')) ORDER BY cod_disc) AS rn
                FROM disciplinas AS dis
                LEFT JOIN departamentos AS dep 
                    ON dep.id_dep = dis.id_dep 
                    AND dep.id_ies = dis.id_ies
                WHERE dis.cod_disc IN (
                    SELECT DISTINCT h.cod_disc
                    FROM historico h
                    JOIN aluno_curso ac ON h.matricula_aluno = ac.matricula_aluno
                    JOIN grad_dis gd ON h.cod_disc = gd.cod_disc
                    WHERE ac.id_curso =  %(id_curso)s
                    AND ac.id_ies = %(id_ies)s
                    AND h.cod_disc IS NOT NULL
                )
            ) subquery
            -- Agora agrupamos por nome normalizado
            GROUP BY nome_normalizado
            HAVING MAX(similarity(nome_normalizado, nome_normalizado)) > 0.70
            ORDER BY nome;
        """

        ret = db.fetch_all(query, id_ies=id_ies, id_curso=id_curso)
        return ret

    @tratamento_excecao_db_grad()
    def disciplinas_departamento(
        self,
        id: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna todas as disciplinas de um departamento.\n

        :param id(str): Código do departamento.
        :param id_ies(str): Código da Universidade.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano final.
        """
        query = """
            select distinct d.* from historico as h
            inner join disciplinas as d on d.cod_disc = h.cod_disc
            where cast(h.ano_letivo as integer) between %(anoi)s and %(anof)s
            and d.id_dep = %(id)s and d.id_ies = %(id_ies)s
        """

        ret = db.fetch_all(query=query, id=id, anoi=anoi, anof=anof, id_ies=id_ies)

        return ret

    @tratamento_excecao_db_grad()
    def quantidade_alunos_por_semestre(
        self,
        id_disc: str,
        anoi: int,
        anof: int,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna a quantidade de alunos de uma disciplina por semestre em um período determinado.\n

        Parâmetros:\n
            id_disc (str): Códigos da disciplina separados por vírgula.
            anoi (int): Ano inicial.
            anof (int): Ano final.
            id_ies (str): Código da Universidade.
        """
        try:
            # Transforma id_disc em uma tupla de strings para a cláusula IN
            id_disc_tuple = tuple(id_disc.split(","))

            query = """
                SELECT foo.ano_letivo, foo.semestre, COUNT(foo.ano_letivo) AS quantidade FROM ( 
                    SELECT historico.ano_letivo, historico.semestre 
                    FROM historico 
                    INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc    
                    AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                    AND historico.cod_disc IN %(id_disc)s
                    AND disciplinas.id_ies = %(id_ies)s
                    GROUP BY matricula_aluno, historico.ano_letivo, historico.semestre
                    ORDER BY historico.ano_letivo, historico.semestre
                ) AS foo
                GROUP BY foo.ano_letivo, foo.semestre
            """
            ret = db.fetch_all(
                query, id_disc=id_disc_tuple, anoi=anoi, anof=anof, id_ies=id_ies
            )

            if not ret:
                raise ValueError(
                    "Nenhum dado encontrado para os parâmetros fornecidos."
                )

            print("---------------------------------------")
            print("Resultado da consulta:")
            print(ret)
            print("---------------------------------------")
            return ret

        except ValueError as e:
            print(f"Erro: {e}")
            return {"erro": str(e)}

        except Exception as e:
            print(f"Erro inesperado: {e}")
            return {"erro": "Erro na execução da consulta."}

    @tratamento_excecao_db_grad()
    def aprovacoes_reprovacoes_por_semestre(
        self,
        id_disc: str,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna aprovações e reprovações de uma disciplina por semestre de um determinado período.\n

        :param id_disc (str): Códigos das disciplinas separados por vírgula.
        :param id_curso (str): Código do curso.
        :param id_ies (str): Código da universidade.
        :param anoi (int): Ano inicial.
        :param anof (int): Ano Final.
        """
        # Transforma id_disc em uma tupla para a cláusula IN
        id_disc_tuple = tuple(id_disc.split(",")) if "," in id_disc else (id_disc,)

        query = """
            WITH nota_min AS (
                SELECT nota_min_aprovacao FROM cursos 
                WHERE id = %(id_curso)s AND id_ies = %(id_ies)s
            )
            SELECT 
                ano_letivo, 
                semestre, 
                CAST(ROUND(100.0 * SUM(CASE WHEN nota >= (SELECT * FROM nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) AS FLOAT) AS taxa_aprovacao,
                CAST(ROUND(100.0 * SUM(CASE WHEN nota < (SELECT * FROM nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) AS FLOAT) AS taxa_reprovacao
            FROM historico
            WHERE cod_disc IN %(id_disc)s
            AND id_ies = %(id_ies)s
            AND CAST(ano_letivo AS INTEGER) BETWEEN %(anoi)s AND %(anof)s
            AND nota IS NOT NULL
            GROUP BY ano_letivo, semestre;
        """

        ret = db.fetch_all(
            query,
            id_disc=id_disc_tuple,
            id_curso=id_curso,
            anoi=anoi,
            anof=anof,
            id_ies=id_ies,
        )
        return ret

    @tratamento_excecao_db_grad()
    def boxplot_notas_disciplina(
        self,
        id_disc: str,
        id_ies: str,
        anoi: str,
        anof: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as medidas do boxplot de uma disciplina.\n

        :param id_disc (str): Códigos das disciplinas separados por vírgula.
        :param id_ies (str): Código da universidade.
        :param anoi (int): Ano inicial.
        :param anof (int): Ano Final.
        """
        # Transforma id_disc em uma tupla para a cláusula IN
        id_disc_tuple = tuple(id_disc.split(",")) if "," in id_disc else (id_disc,)

        query = """
            WITH query_notas AS (
                SELECT d.nome, nota,
                    ntile(4) OVER (PARTITION BY d.nome ORDER BY nota) AS quartil
                FROM historico AS h 
                INNER JOIN disciplinas AS d ON d.cod_disc = h.cod_disc
                WHERE h.cod_disc IN %(id_disc)s 
                AND h.id_ies = %(id_ies)s
                AND CAST(h.ano_letivo AS INTEGER) BETWEEN %(anoi)s AND %(anof)s
                AND nota IS NOT NULL
            ), 
            query_quartis AS (
                SELECT 
                    CAST(MAX(CASE WHEN quartil = 1 THEN nota END) AS FLOAT) AS primeiro_quartil,
                    CAST(MAX(CASE WHEN quartil = 2 THEN nota END) AS FLOAT) AS segundo_quartil,
                    CAST(MAX(CASE WHEN quartil = 3 THEN nota END) AS FLOAT) AS terceiro_quartil,
                    CAST(ROUND(STDDEV_POP(nota), 2) AS FLOAT) AS desvio_padrao,
                    CAST(ROUND(AVG(nota), 2) AS FLOAT) AS media
                FROM query_notas
                HAVING MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
            )
            SELECT *,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) AS limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) AS limite_superior
            FROM query_quartis;
        """

        ret = db.fetch_all(
            query,
            id_disc=id_disc_tuple,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        return ret

    @tratamento_excecao_db_grad()
    def histograma_notas_disciplina(
        self,
        id_disc: str,
        anoi: str,
        anof: str,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna um histograma de notas de uma ou mais disciplinas.

        :param id_disc (str): Códigos das disciplinas separados por vírgula.
        :param anoi (str): Ano inicial.
        :param anof (str): Ano final.
        :param id_ies (str): Código da universidade.
        :param db (DBConnectorGRAD): Conexão com o banco de dados.
        """
        # Transforma id_disc em uma tupla para a cláusula IN
        id_disc_tuple = tuple(id_disc.split(",")) if "," in id_disc else (id_disc,)

        query = """
            WITH notas AS (
                SELECT nota 
                FROM historico 
                WHERE cod_disc IN %(id_disc)s 
                AND id_ies = %(id_ies)s
                AND CAST(ano_letivo AS INTEGER) BETWEEN %(anoi)s AND %(anof)s
                AND nota IS NOT NULL
            )
            SELECT
                SUM(CASE WHEN nota >= 0 AND nota < 10 THEN 1 ELSE 0 END) AS "[0_10)",
                SUM(CASE WHEN nota >= 10 AND nota < 20 THEN 1 ELSE 0 END) AS "[10_20)",
                SUM(CASE WHEN nota >= 20 AND nota < 30 THEN 1 ELSE 0 END) AS "[20_30)",
                SUM(CASE WHEN nota >= 30 AND nota < 40 THEN 1 ELSE 0 END) AS "[30_40)",
                SUM(CASE WHEN nota >= 40 AND nota < 50 THEN 1 ELSE 0 END) AS "[40_50)",
                SUM(CASE WHEN nota >= 50 AND nota < 60 THEN 1 ELSE 0 END) AS "[50_60)",
                SUM(CASE WHEN nota >= 60 AND nota < 70 THEN 1 ELSE 0 END) AS "[60_70)",
                SUM(CASE WHEN nota >= 70 AND nota < 80 THEN 1 ELSE 0 END) AS "[70_80)",
                SUM(CASE WHEN nota >= 80 AND nota < 90 THEN 1 ELSE 0 END) AS "[80_90)",
                SUM(CASE WHEN nota >= 90 AND nota <= 100 THEN 1 ELSE 0 END) AS "[90_100]"
            FROM notas;
        """

        ret = db.fetch_all(
            query=query, id_disc=id_disc_tuple, id_ies=id_ies, anoi=anoi, anof=anof
        )
        return ret

    @tratamento_excecao_db_grad()
    def boxplot_notas_grade(
        self,
        id_curso: str,
        id_ies: str,
        serie: int,
        db: DBConnectorGRAD = None,
    ):
        """

        :param id_curso(str): Código do curso.
        :param id_ies(str): Código da instituição.
        :param serie(int): Série.
        """

        query = """

                DROP TABLE IF EXISTS disciplinas_soun;
                CREATE TEMP TABLE disciplinas_soun AS
                SELECT 
                    cod_disc,
                    SOUNDEX(nome) AS soundex_nome,
                    nome,
                    -- Gerando abreviação a partir do nome da disciplina
                    array_to_string(
                        ARRAY(
                            SELECT UPPER(SUBSTRING(word, 1, 1)) 
                            FROM unnest(string_to_array(nome, ' ')) AS word
                        ), 
                        ''  -- Usando uma string vazia para separar as letras, assim não haverá vírgula
                    ) AS abreviacao
                FROM disciplinas;

                WITH disciplinas_serie AS (
					SELECT distinct h.cod_disc
					FROM historico h
					JOIN aluno_curso ac ON h.matricula_aluno = ac.matricula_aluno
					JOIN grad_dis gd ON h.cod_disc = gd.cod_disc
					WHERE ac.id_curso = %(id_curso)s
					AND ac.id_ies = %(id_ies)s
					and h.cod_disc is not null
					and gd.serie = %(serie)s
                ), 
                query_notas AS (
                    SELECT 
                        ds.soundex_nome AS soundex_nome, 
                        ds.nome, 
                        ds.abreviacao,  -- Incluindo a abreviação gerada
                        h.nota,
                        NTILE(4) OVER (PARTITION BY ds.soundex_nome ORDER BY h.nota) AS quartil
                    FROM historico AS h 
                    INNER JOIN disciplinas_soun AS ds ON ds.cod_disc = h.cod_disc
                    WHERE h.cod_disc IN (SELECT * FROM disciplinas_serie) 
                    AND h.id_ies = %(id_ies)s
                    AND h.nota IS NOT NULL
                ), 
                query_quartis AS (
                    SELECT
                        nome,
                        abreviacao,  -- Incluindo a abreviação gerada
                        CAST(MAX(CASE WHEN quartil = 1 THEN nota END) AS FLOAT) AS primeiro_quartil,
                        CAST(MAX(CASE WHEN quartil = 2 THEN nota END) AS FLOAT) AS segundo_quartil,
                        CAST(MAX(CASE WHEN quartil = 3 THEN nota END) AS FLOAT) AS terceiro_quartil,
                        CAST(ROUND(STDDEV_POP(nota), 2) AS FLOAT) AS desvio_padrao,
                        CAST(ROUND(AVG(nota), 2) AS FLOAT) AS media
                    FROM query_notas
                    GROUP BY nome, abreviacao  -- Incluindo abreviação no GROUP BY
                    HAVING MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                    AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                    AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
                ), 
                abreviacao_unica AS (
                    SELECT nome,
                        abreviacao,
                        primeiro_quartil,
                        segundo_quartil,
                        terceiro_quartil,
                        desvio_padrao,
                        media,
                        ROW_NUMBER() OVER (PARTITION BY abreviacao ORDER BY nome) AS numero
                    FROM query_quartis
                )
                SELECT 
                    nome,
                    CASE 
                        WHEN numero > 1 THEN abreviacao || CAST(numero AS TEXT)  -- Se houver colisão, adiciona um número
                        ELSE abreviacao
                    END AS abreviacao,
                    primeiro_quartil,
                    segundo_quartil,
                    terceiro_quartil,
                    desvio_padrao,
                    media,
                    GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) AS limite_inferior,
                    LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) AS limite_superior
                FROM abreviacao_unica
                ORDER BY nome;
        """

        ret = db.fetch_all(query=query, id_curso=id_curso, id_ies=id_ies, serie=serie)
        return ret

    @tratamento_excecao_db_grad()
    def evasao_disciplina(
        self,
        id_disc: str,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna a taxa de evasão e não evasão de uma ou mais disciplinas por semestre.

        :param id_disc (str): Códigos das disciplinas separados por vírgula.
        :param id_curso (str): Código do curso.
        :param id_ies (str): Código da instituição.
        :param anoi (int): Ano inicial.
        :param anof (int): Ano final.
        :param db (DBConnectorGRAD): Conexão com o banco de dados.
        """

        # Transforma id_disc em uma tupla para a cláusula IN
        id_disc_tuple = tuple(id_disc.split(",")) if "," in id_disc else (id_disc,)

        query = """
            WITH freq_min AS (
                SELECT freq_min_aprovacao FROM cursos WHERE id = %(id_curso)s AND id_ies = %(id_ies)s
            )
            SELECT
                h.ano_letivo,
                h.semestre,
                CAST(
                    ROUND(100 * SUM(CASE WHEN h.percentual_freq < (SELECT * FROM freq_min) THEN 1 ELSE 0 END) / COUNT(*), 2) 
                    AS FLOAT
                ) AS evasao,
                100 - CAST(
                    ROUND(100 * SUM(CASE WHEN h.percentual_freq < (SELECT * FROM freq_min) THEN 1 ELSE 0 END) / COUNT(*), 2) 
                    AS FLOAT
                ) AS nao_evasao
            FROM historico AS h
            WHERE h.cod_disc IN %(id_disc)s 
            AND h.id_ies = %(id_ies)s
            AND CAST(h.ano_letivo AS INTEGER) BETWEEN %(anoi)s AND %(anof)s
            AND h.percentual_freq IS NOT NULL
            GROUP BY h.ano_letivo, h.semestre;
        """

        ret = db.fetch_all(
            query=query,
            id_disc=id_disc_tuple,
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        return ret

    @tratamento_excecao_db_grad()
    def boxplot_notas_evasao(
        self,
        id_disc: str,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as medidas do boxplot de notas para os alunos que evadiram de uma ou mais disciplinas.

        :param id_disc (str): Códigos das disciplinas separados por vírgula.
        :param id_curso (str): Código do curso.
        :param id_ies (str): Código da instituição.
        :param anoi (int): Ano inicial.
        :param anof (int): Ano final.
        :param db (DBConnectorGRAD): Conexão com o banco de dados.
        """

        # Transforma id_disc em uma tupla para a cláusula IN
        id_disc_tuple = tuple(id_disc.split(",")) if "," in id_disc else (id_disc,)

        query = """
            WITH freq_min AS (
                SELECT freq_min_aprovacao FROM cursos WHERE id = %(id_curso)s AND id_ies = %(id_ies)s
            ),
            query_notas AS (
                SELECT 
                    h.nota,
                    (CASE WHEN h.percentual_freq < (SELECT * FROM freq_min) THEN true ELSE false END) AS evasao,
                    ntile(4) OVER (
                        PARTITION BY (
                            CASE WHEN h.percentual_freq < (SELECT * FROM freq_min) THEN true ELSE false END
                        ) 
                        ORDER BY h.nota
                    ) AS quartil
                FROM historico AS h 
                WHERE h.cod_disc IN %(id_disc)s 
                AND h.id_ies = %(id_ies)s
                AND CAST(h.ano_letivo AS INTEGER) BETWEEN %(anoi)s AND %(anof)s
                AND h.nota IS NOT NULL
                AND h.percentual_freq IS NOT NULL
            ), 
            query_quartis AS (
                SELECT
                    qn.evasao,
                    CAST(MAX(CASE WHEN qn.quartil = 1 THEN qn.nota END) AS FLOAT) AS primeiro_quartil,
                    CAST(MAX(CASE WHEN qn.quartil = 2 THEN qn.nota END) AS FLOAT) AS segundo_quartil,
                    CAST(MAX(CASE WHEN qn.quartil = 3 THEN qn.nota END) AS FLOAT) AS terceiro_quartil,
                    CAST(ROUND(STDDEV_POP(qn.nota), 2) AS FLOAT) AS desvio_padrao,
                    CAST(ROUND(AVG(qn.nota), 2) AS FLOAT) AS media
                FROM query_notas AS qn
                GROUP BY qn.evasao
                HAVING MAX(CASE WHEN qn.quartil = 1 THEN qn.nota END) IS NOT NULL
                AND MAX(CASE WHEN qn.quartil = 2 THEN qn.nota END) IS NOT NULL
                AND MAX(CASE WHEN qn.quartil = 3 THEN qn.nota END) IS NOT NULL
            )
            SELECT *,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) AS limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) AS limite_superior
            FROM query_quartis;
        """

        ret = db.fetch_all(
            query=query,
            id_disc=id_disc_tuple,
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        return ret

    @tratamento_excecao_db_grad()
    def boxplot_desempenho_alunos_professor(
        self,
        id_disc: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as medidas do boxplot de notas para cada professor em uma disciplina.
        Compara o desempenho dos alunos por cada professor em uma disciplina.

        :param id_disc(str): Códigos das Disciplinas separados por vírgula.
        :param id_ies(str): Código da Instituição
        :param anoi(int): Ano Inicial
        :param anof(int): Ano Final
        """

        # Transforma id_disc em uma tupla para a cláusula IN
        id_disc_tuple = tuple(id_disc.split(",")) if "," in id_disc else (id_disc,)

        query = """
            WITH query_notas AS (
                SELECT 
                    id_prof, 
                    nota,
                    NTILE(4) OVER (PARTITION BY id_prof ORDER BY nota) AS quartil
                FROM historico AS h 
                INNER JOIN disciplinas AS d ON d.cod_disc = h.cod_disc
                WHERE h.cod_disc IN %(id_disc)s 
                    AND h.id_ies = %(id_ies)s
                    AND CAST(h.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                    AND nota IS NOT NULL
            ), 
            query_quartis AS (
                SELECT
                    id_prof,
                    CAST(MAX(CASE WHEN quartil = 1 THEN nota END) AS float) AS primeiro_quartil,
                    CAST(MAX(CASE WHEN quartil = 2 THEN nota END) AS float) AS segundo_quartil,
                    CAST(MAX(CASE WHEN quartil = 3 THEN nota END) AS float) AS terceiro_quartil,
                    CAST(ROUND(STDDEV_POP(nota), 2) AS float) AS desvio_padrao,
                    CAST(ROUND(AVG(nota), 2) AS float) AS media
                FROM query_notas
                GROUP BY id_prof
                HAVING MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
            )
            SELECT qq.*,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) AS limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) AS limite_superior,
                p.nome
            FROM query_quartis AS qq
            INNER JOIN professores AS p ON p.id = qq.id_prof
        """

        # Executa a consulta
        ret = db.fetch_all(
            query=query, id_disc=id_disc_tuple, id_ies=id_ies, anoi=anoi, anof=anof
        )

        return ret

    @tratamento_excecao_db_grad()
    def taxa_aprovacao_reprovacao_serie(
        self,
        id_curso: str,
        id_ies: str,
        serie: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as taxas de aprovação e reprovação de uma série.

        :param id_curso(str): Código do Curso
        :param id_ies(str): Código da Instituição
        :param serie(int): Série/Período
        """

        query = """

  
                WITH nota_min AS (
                    SELECT nota_min_aprovacao 
                    FROM cursos 
                    WHERE id =  %(id_curso)s AND id_ies = %(id_ies)s
                ),
                notas_historico AS (
					SELECT distinct h.cod_disc, h.id_ies, h.nota
					FROM historico h
					JOIN aluno_curso ac ON h.matricula_aluno = ac.matricula_aluno
					JOIN grad_dis gd ON h.cod_disc = gd.cod_disc
					WHERE ac.id_curso =  %(id_curso)s
					AND ac.id_ies = %(id_ies)s
					and h.cod_disc is not null
					and gd.serie = %(serie)s
                ),
                abreviacoes_geradas AS (
                    SELECT
                        MIN(ds.nome) AS disciplina_representativa, -- Escolhe um nome qualquer do grupo
                        CAST(ROUND(100.0 * SUM(CASE WHEN nh.nota >= (SELECT * FROM nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) AS FLOAT) AS taxa_aprovacao,
                        CAST(ROUND(100.0 * SUM(CASE WHEN nh.nota < (SELECT * FROM nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) AS FLOAT) AS taxa_reprovacao,
                        -- Gerando a abreviação para cada grupo de disciplinas com o mesmo SOUNDEX
                        array_to_string(
                            ARRAY(
                                SELECT UPPER(SUBSTRING(word, 1, 1)) 
                                FROM unnest(string_to_array(MIN(ds.nome), ' ')) AS word
                            ), 
                            ''  -- Usando uma string vazia para separar as letras, assim não haverá vírgula
                        ) AS abreviacao,
                        SOUNDEX(ds.nome) AS soundex_nome
                    FROM notas_historico nh
                    INNER JOIN disciplinas ds 
                        ON ds.cod_disc = nh.cod_disc 
                        AND ds.id_ies = nh.id_ies 
                    GROUP BY SOUNDEX(ds.nome)  -- Agrupa nomes semelhantes foneticamente
                ),
                abreviacao_unica AS (
                    SELECT
                        disciplina_representativa,
                        taxa_aprovacao,
                        taxa_reprovacao,
                        abreviacao,
                        ROW_NUMBER() OVER (PARTITION BY abreviacao ORDER BY disciplina_representativa) AS numero
                    FROM abreviacoes_geradas
                )
                SELECT 
                    disciplina_representativa as nome,
                    taxa_aprovacao,
                    taxa_reprovacao,
                    CASE 
                        WHEN numero > 1 THEN abreviacao || CAST(numero AS TEXT)  -- Se houver colisão, adiciona um número
                        ELSE abreviacao
                    END AS abreviacao
                FROM abreviacao_unica
                
        """

        ret = db.fetch_all(
            query=query,
            id_curso=id_curso,
            id_ies=id_ies,
            serie=serie,
        )

        return ret

    @tratamento_excecao_db_grad()
    def boxplot_desempenho_cotistas(
        self,
        id_disc: str,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as medidas do boxplot para alunos cotistas e não cotistas.

        :param id_disc(str): Códigos das Disciplinas separados por vírgula.
        :param id_ies(str): Código da Instituição
        """
        # Transforma id_disc em uma tupla para a cláusula IN
        id_disc_tuple = tuple(id_disc.split(",")) if "," in id_disc else (id_disc,)

        query = """
            WITH query_notas AS (
                SELECT 
                    nota,
                    fi.cota,
                    NTILE(4) OVER (PARTITION BY fi.cota ORDER BY nota) AS quartil
                FROM historico AS h
                INNER JOIN aluno_curso AS ac 
                    ON ac.matricula_aluno = h.matricula_aluno 
                    AND ac.id_ies = h.id_ies
                INNER JOIN formasingresso AS fi 
                    ON fi.id = ac.id_forma_ing
                    AND fi.id_ies = ac.id_ies
                WHERE h.cod_disc IN %(id_disc)s 
                    AND h.id_ies = %(id_ies)s
                    AND nota IS NOT NULL
            ),
            query_quartis AS (
                SELECT
                    cota,
                    CAST(MAX(CASE WHEN quartil = 1 THEN nota END) AS FLOAT) AS primeiro_quartil,
                    CAST(MAX(CASE WHEN quartil = 2 THEN nota END) AS FLOAT) AS segundo_quartil,
                    CAST(MAX(CASE WHEN quartil = 3 THEN nota END) AS FLOAT) AS terceiro_quartil,
                    CAST(ROUND(STDDEV_POP(nota), 2) AS FLOAT) AS desvio_padrao,
                    CAST(ROUND(AVG(nota), 2) AS FLOAT) AS media
                FROM query_notas
                GROUP BY cota
                HAVING MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
            )
            SELECT *,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) AS limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) AS limite_superior
            FROM query_quartis;
        """

        # Executa a consulta
        ret = db.fetch_all(query=query, id_disc=id_disc_tuple, id_ies=id_ies)

        return ret

    @tratamento_excecao_db_grad()
    def histograma_desempenho_cotistas(
        self,
        id_disc: str,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna os dados para montagem do histograma de cotistas e não cotistas.

        :param id_disc(str): Códigos das Disciplinas separados por vírgula.
        :param id_ies(str): Código da Instituição
        """
        # Transforma id_disc em uma tupla para a cláusula IN
        id_disc_tuple = tuple(id_disc.split(",")) if "," in id_disc else (id_disc,)

        query = """
            WITH notas AS (
                SELECT nota, cota
                FROM historico AS h
                INNER JOIN aluno_curso AS ac 
                    ON ac.id = h.id_aluno_curso 
                    AND ac.id_ies = h.id_ies
                INNER JOIN formasingresso AS fi 
                    ON fi.id = ac.id_forma_ing 
                    AND fi.id_ies = ac.id_ies
                WHERE h.cod_disc IN %(id_disc)s 
                    AND h.id_ies = %(id_ies)s
                    AND nota IS NOT NULL
            )
            SELECT
                cota,
                SUM(CASE WHEN nota >= 0 AND nota < 50 THEN 1 END) AS "[0_50)",
                SUM(CASE WHEN nota >= 50 AND nota < 70 THEN 1 END) AS "[50_70)",
                SUM(CASE WHEN nota >= 70 AND nota < 80 THEN 1 END) AS "[70_80)",
                SUM(CASE WHEN nota >= 80 AND nota < 90 THEN 1 END) AS "[80_90)",
                SUM(CASE WHEN nota >= 90 AND nota <= 100 THEN 1 END) AS "[90_100]"
            FROM notas
            GROUP BY cota
        """

        # Executa a consulta
        ret = db.fetch_all(query=query, id_disc=id_disc_tuple, id_ies=id_ies)

        return ret

    @tratamento_excecao_db_grad()
    def classificacao_disciplinas(
        self,
        id_curso: str,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as informações para fazer a classificação(fácil, médio e difícil) das disciplinas de um curso.
        """

        query = """
                WITH query_disciplinas AS (
                    SELECT cod_disc 
                    FROM historico h
                    JOIN aluno_curso ac ON h.matricula_aluno = ac.matricula_aluno
                    WHERE ac.id_curso = %(id_curso)s
                    AND ac.id_ies = %(id_ies)s
                ),
                nota_min_aprovacao AS (
                    SELECT nota_min_aprovacao 
                    FROM cursos 
                    WHERE id = %(id_curso)s
                    AND id_ies = %(id_ies)s
                ),
                query_quartis AS (
                    SELECT h.cod_disc, d.nome, d.abreviacao, nota,
                        ntile(4) OVER (PARTITION BY d.cod_disc ORDER BY nota) AS quartil
                    FROM historico AS h 
                    INNER JOIN disciplinas AS d ON d.cod_disc = h.cod_disc
                    INNER JOIN query_disciplinas AS qd ON qd.cod_disc = h.cod_disc
                    WHERE h.cod_disc IN (SELECT cod_disc FROM query_disciplinas)
                    AND nota IS NOT NULL
                ),
                agrupamento_nomes AS (
                    SELECT 
                        MIN(nome) AS disciplina_representativa, -- Escolhe um nome qualquer do grupo
                        SOUNDEX(nome) AS soundex_nome
                    FROM query_quartis
                    GROUP BY SOUNDEX(nome)
                ),
                disciplinas_com_abreviacao AS (
                    SELECT 
                        an.disciplina_representativa,
                        qq.nota,
                        qq.quartil,
                        SOUNDEX(an.disciplina_representativa) AS soundex_nome
                    FROM query_quartis qq
                    INNER JOIN agrupamento_nomes an ON SOUNDEX(qq.nome) = an.soundex_nome
                )
                SELECT 
                    disciplina_representativa AS nome, 
                    MAX(CASE WHEN quartil = 1 THEN nota END) AS primeiro_quartil,
                    MAX(CASE WHEN quartil = 2 THEN nota END) AS segundo_quartil,
                    MAX(CASE WHEN quartil = 3 THEN nota END) AS terceiro_quartil,
                    ROUND(AVG(nota), 2) AS media,
                    ROUND(100.0 * SUM(CASE WHEN nota >= (SELECT * FROM nota_min_aprovacao) THEN 1 ELSE 0 END) / COUNT(*), 2) AS taxa_aprovacao,
                    COUNT(*) AS total_alunos
                FROM disciplinas_com_abreviacao
                GROUP BY disciplina_representativa
                HAVING 
                    MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                    AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                    AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
                ORDER BY disciplina_representativa;
            """

        ret = db.fetch_all(query=query, id_curso=id_curso, id_ies=id_ies)
        return ret


queries_disciplinas = QueriesDisciplinas()
