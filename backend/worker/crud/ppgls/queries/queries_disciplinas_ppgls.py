from backend.db.db import DBConnectorGRAD
from backend.core.utils import tratamento_excecao_com_db

class QueriesDisciplinas():
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def retorna_disciplina(self, id_disc: str,id_ies: str, db: DBConnectorGRAD = None):
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
    
    @tratamento_excecao_com_db(tipo_banco='grad')
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
            ORDER BY nome_agrupado;
        """

        ret = db.fetch_all(
            query, id_ies=id_ies, id_curso=id_curso
        )
        return ret




    @tratamento_excecao_com_db(tipo_banco='grad')
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



    @tratamento_excecao_com_db(tipo_banco='grad')
    def quantidade_alunos_por_semestre(self, id_disc: str, anoi: int, anof: int, id_ies: str, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos de uma disciplina por semestre em um período determinado.\n

        Parâmetros:\n
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano final. 
            id_ies(str): Código da Universidade.
        """
        try:
            query = """
                SELECT foo.ano_letivo, foo.semestre, COUNT(foo.ano_letivo) AS quantidade FROM ( 
                    SELECT historico.ano_letivo, historico.semestre FROM historico 
                    INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc    
                    AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                    AND historico.cod_disc= %(id_disc)s
                    AND disciplinas.id_ies = %(id_ies)s
                    GROUP BY matricula_aluno, historico.ano_letivo, historico.semestre
                    ORDER BY historico.ano_letivo, historico.semestre
                ) AS foo
                GROUP BY foo.ano_letivo, foo.semestre
            """
            ret = db.fetch_all(query, id_disc=id_disc, anoi=anoi, anof=anof, id_ies=id_ies)

            if not ret:
                raise ValueError("Nenhum dado encontrado para os parâmetros fornecidos.")

            print("---------------------------------------")
            print("Resultado da consulta:")
            print(ret)
            print("---------------------------------------")
            return ret

        except ValueError as e:
            print(f"Erro: {e}")
            # Trate a exceção conforme necessário, como retornar um valor padrão ou logar o erro
            return {"erro": str(e)}

        except Exception as e:
            print(f"Erro inesperado: {e}")
            # Trate outros tipos de erro aqui, como problemas de banco de dados
            return {"erro": "Erro na execução da consulta."}


    @tratamento_excecao_com_db(tipo_banco='grad')
    def aprovacoes_reprovacoes_por_semestre(
        self,
        id_disc: int,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna aprovações e reprovações de uma disciplina por semestre de um determinado período.\n

        :param id_disc(str): Código da disciplina.
        :param id_curso(str): Código do curso.
        :param id_ies(str): Código da universidade.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano Final.
        """
        query = """
            with nota_min as (
                select nota_min_aprovacao from cursos 
                where id = %(id_curso)s and id_ies = %(id_ies)s
            )
            select 
                ano_letivo, 
                semestre, 
                cast(round(100.0 * SUM(CASE WHEN nota >= (select * from nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) as float) AS taxa_aprovacao,
                cast(round(100.0 * SUM(CASE WHEN nota < (select * from nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) as float) AS taxa_reprovacao
            from historico
            where cod_disc = %(id_disc)s
            and id_ies = %(id_ies)s
            and cast(ano_letivo as integer) between %(anoi)s and %(anof)s
            and nota is not null
            group by ano_letivo, semestre;
        """
        ret = db.fetch_all(
            query,
            id_disc=id_disc,
            id_curso=id_curso,
            anoi=anoi,
            anof=anof,
            id_ies=id_ies,
        )
        return ret


    @tratamento_excecao_com_db(tipo_banco='grad')
    def boxplot_notas_disciplina(
        self,
        id_disc: int,
        id_ies: str,
        anoi: str,
        anof: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as medidas do boxplot de uma disciplina.\n

        :param id(str): Código da disciplina.
        :param id_ies(str): Código da universidade.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano Final.
        """
        query = """
            with query_notas as (
                select d.nome, nota,
                ntile(4) over (partition by d.nome order by nota) as quartil
                from historico as h 
                inner join disciplinas as d on d.cod_disc = h.cod_disc
                where h.cod_disc = %(id_disc)s and h.id_ies = %(id_ies)s
                and cast(h.ano_letivo as integer) between %(anoi)s and %(anof)s
                and nota is not null
            ), 
            query_quartis as (
                select 
                    cast(max(case when quartil = 1 then nota end) as float) as primeiro_quartil,
                    cast(max(case when quartil = 2 then nota end) as float) as segundo_quartil,
                    cast(max(case when quartil = 3 then nota end) as float) as terceiro_quartil,
                    cast(round(stddev_pop(nota), 2) as float) as desvio_padrao,
                    cast(round(avg(nota), 2) as float) as media
                from query_notas
                having MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
            )
            select *,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) as limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) as limite_superior
            from query_quartis;
        """
        ret = db.fetch_all(query, id_disc=id_disc, anoi=anoi, anof=anof, id_ies=id_ies)
        return ret


    # TESTE
    @tratamento_excecao_com_db(tipo_banco='grad')
    def histograma_notas_disciplina( self, id_disc: int, anoi: str, anof: str, id_ies: str, db: DBConnectorGRAD = None):
        query = """
            WITH notas AS (
                SELECT nota 
                FROM historico 
                WHERE cod_disc = %(id_disc)s 
                AND id_ies = %(id_ies)s
                AND CAST(ano_letivo AS integer) BETWEEN %(anoi)s and %(anof)s
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
            query=query, id_disc=id_disc, id_ies=id_ies, anoi=anoi, anof=anof
        )
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
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

        ret = db.fetch_all(
            query=query,
            id_curso=id_curso,
            id_ies=id_ies,
            serie=serie
        )
        return ret


    @tratamento_excecao_com_db(tipo_banco='grad')
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
        Retorna a taxa de evasão e não evasão de uma disciplina por semestre.

        :param id_disc(str): Código da Disciplina
        :param id_curso(str): Código do Curso
        :param id_ies(str): Código da Instituição
        :param anoi(int): Ano Inicial
        :param anof(int): Ano Final
        """

        query = """
            with freq_min as (
                select freq_min_aprovacao from cursos where id = %(id_curso)s and id_ies = %(id_ies)s
            )
            select
                ano_letivo,
                semestre,
                cast(ROUND(100 * SUM(CASE WHEN h.percentual_freq < (SELECT * from freq_min) THEN 1 ELSE 0 END)/COUNT(*), 2) as float)
                    as evasao,
                100 - cast(ROUND(100 * SUM(CASE WHEN h.percentual_freq < (SELECT * from freq_min) THEN 1 ELSE 0 END)/COUNT(*), 2) as float)
                    as nao_evasao
            from historico as h
            where h.cod_disc = %(id_disc)s and h.id_ies = %(id_ies)s
            and cast(ano_letivo as integer) between %(anoi)s and %(anof)s
            and percentual_freq is not null
            group by ano_letivo, semestre;
        """

        ret = db.fetch_all(
            query=query,
            id_disc=id_disc,
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
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
        Retorna as medidas do boxplot de notas para os alunos que evadiram de uma disciplina.

        :param id_disc(str): Código da Disciplina
        :param id_curso(str): Código do Curso
        :param id_ies(str): Código da Instituição
        :param anoi(int): Ano Inicial
        :param anof(int): Ano Final
        """

        query = """
            with freq_min as (
                select freq_min_aprovacao from cursos where id = %(id_curso)s and id_ies = %(id_ies)s
            ),
            query_notas as (
                select nota,
                (
                    CASE
                        WHEN percentual_freq < (select * from freq_min) THEN true ELSE false 
                    END
                ) 
                as evasao,
                ntile(4) over (
                    partition by (
                        CASE
                            WHEN percentual_freq < (select * from freq_min) THEN true ELSE false 
                        END
                    ) 
                    order by nota
                ) as quartil
                from historico as h 
                where h.cod_disc = %(id_disc)s and h.id_ies = %(id_ies)s
                and cast(ano_letivo as integer) between %(anoi)s and %(anof)s
                and nota is not null
                and percentual_freq is not null
            ), 
            query_quartis as (
                select
                    evasao,
                    cast(max(case when quartil = 1 then nota end) as float) as primeiro_quartil,
                    cast(max(case when quartil = 2 then nota end) as float) as segundo_quartil,
                    cast(max(case when quartil = 3 then nota end) as float) as terceiro_quartil,
                    cast(round(stddev_pop(nota), 2) as float) as desvio_padrao,
                    cast(round(avg(nota), 2) as float) as media
                from query_notas
                group by evasao
                having MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
            )
            select *,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) as limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) as limite_superior
            from query_quartis;
        """

        ret = db.fetch_all(
            query=query,
            id_disc=id_disc,
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
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

        :param id_disc(str): Código da Disciplina
        :param id_ies(str): Código da Instituição
        :param anoi(int): Ano Inicial
        :param anof(int): Ano Final
        """

        query = """
            with query_notas as (
                select 
                    id_prof, 
                    nota,
                    ntile(4) over (partition by id_prof order by nota) as quartil
                from historico as h 
                inner join disciplinas as d on d.cod_disc = h.cod_disc
                where h.cod_disc = %(id_disc)s and h.id_ies = %(id_ies)s
                and cast(h.ano_letivo as integer) between %(anoi)s and %(anof)s
                and nota is not null
            ), 
            query_quartis as (
                select
                    id_prof,
                    cast(max(case when quartil = 1 then nota end) as float) as primeiro_quartil,
                    cast(max(case when quartil = 2 then nota end) as float) as segundo_quartil,
                    cast(max(case when quartil = 3 then nota end) as float) as terceiro_quartil,
                    cast(round(stddev_pop(nota), 2) as float) as desvio_padrao,
                    cast(round(avg(nota), 2) as float) as media
                from query_notas
                group by id_prof
                having MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
            )
            select qq.*,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) as limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) as limite_superior,
                p.nome
            from query_quartis as qq
            inner join professores as p on p.id = qq.id_prof
        """

        ret = db.fetch_all(
            query=query, id_disc=id_disc, id_ies=id_ies, anoi=anoi, anof=anof
        )

        return ret
    
 
    @tratamento_excecao_com_db(tipo_banco='grad')
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

    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def boxplot_desempenho_cotistas(
        self,
        id_disc: str,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as medidas do boxplot para alunos cotistas e não cotistas.

        :param id_disc(str): Código da Disciplina
        :param id_ies(str): Código da Instituição
        """
        query = """
            with query_notas as (
                select 
                    nota,
                    fi.cota,
                    ntile(4) over (partition by fi.cota order by nota) as quartil
                from historico as h
                inner join aluno_curso as ac on ac.matricula_aluno = h.matricula_aluno and ac.id_ies = h.id_ies
                inner join formasingresso as fi on fi.id = ac.id_forma_ing and fi.id_ies = ac.id_ies
                where h.cod_disc = %(id_disc)s and h.id_ies = %(id_ies)s
                and nota is not null
            ),
            query_quartis as (
                select
                    cota,
                    cast(max(case when quartil = 1 then nota end) as float) as primeiro_quartil,
                    cast(max(case when quartil = 2 then nota end) as float) as segundo_quartil,
                    cast(max(case when quartil = 3 then nota end) as float) as terceiro_quartil,
                    cast(round(stddev_pop(nota), 2) as float) as desvio_padrao,
                    cast(round(avg(nota), 2) as float) as media
                from query_notas
                group by cota
                having MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
            )
            select *,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) as limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) as limite_superior
            from query_quartis;
        """

        ret = db.fetch_all(query=query, id_disc=id_disc, id_ies=id_ies)

        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def histograma_desempenho_cotistas(
        self,
        id_disc: str,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna os dados para montagem do histograma de cotistas e não cotistas.

        :param id_disc(str): Código da Disciplina
        :param id_ies(str): Código da Instituição
        """
        query = """
            with notas as (
                select nota, cota from historico as h
                inner join aluno_curso as ac on ac.id = h.id_aluno_curso and ac.id_ies = h.id_ies
                inner join formasingresso as fi on fi.id = ac.id_forma_ing and fi.id_ies = ac.id_ies
                where cod_disc = %(id_disc)s and h.id_ies = %(id_ies)s
                and nota is not null
            )
            select
                cota,
                sum((case when nota >= 0 and nota < 50 then 1 end)) as "[0_50)",
                sum((case when nota >= 50 and nota < 70 then 1 end)) as "[50_70)",
                sum((case when nota >= 70 and nota < 80 then 1 end)) as "[70_80)",
                sum((case when nota >= 80 and nota < 90 then 1 end)) as "[80_90)",
                sum((case when nota >= 90 and nota <= 100 then 1 end)) as "[90_100]"
            from notas
            group by cota
        """

        ret = db.fetch_all(query=query, id_disc=id_disc, id_ies=id_ies)

        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
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
