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
            INNER JOIN departamentos AS dep ON dep.id_dep = dis.id_dep AND dep.id_ies = dis.id_ies
            WHERE cod_disc = %(id_disc)s and dis.id_ies = %(id_ies)s
        """

        ret = db.fetch_one(query, id_disc=id_disc, id_ies=id_ies)
        print("Query")
        print(ret)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def disciplinas_grade(
        self,
        id_grade: str,
        id_curso: str,
        id_ies: str,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna todas as disciplinas de um curso.

        :param id_grade(str): Código da Grade Curricular.
        :param id_curso(str): Código do curso.
        :param id_ies(str): Código da Universidade.
        """
        if id_grade:
            query = """
                SELECT 
                    cod_disc, 
                    dis.nome, 
                    dis.abreviacao, 
                    cast(carga_horaria as float),
                    dep.nome as departamento 
                FROM disciplinas AS dis
                INNER JOIN departamentos AS dep ON dep.id_dep = dis.id_dep AND dep.id_ies = dis.id_ies
                WHERE dis.cod_disc in 
                    (select cod_disc from grad_dis where id_curso = %(id_curso)s and id_ies = %(id_ies)s and id_grade = %(id_grade)s)
                order by nome
            """

            ret = db.fetch_all(
                query, id_ies=id_ies, id_grade=id_grade, id_curso=id_curso
            )
            return ret

        query = """
            with ultima_grade as (
                select id_grade from grades where id_curso = %(id_curso)s
                and id_ies = %(id_ies)s
                order by ano desc, semestre desc
                limit 1
            )
            SELECT 
                cod_disc, 
                dis.nome, 
                dis.abreviacao, 
                cast(carga_horaria as float),
                dep.nome as departamento 
            FROM disciplinas AS dis
            INNER JOIN departamentos AS dep ON dep.id_dep = dis.id_dep AND dep.id_ies = dis.id_ies
            WHERE dis.cod_disc in 
                (
                    select cod_disc from grad_dis 
                    where id_curso = %(id_curso)s and id_ies = %(id_ies)s and id_grade = (select * from ultima_grade)
                )
            order by nome
        """
        ret = db.fetch_all(query, id_ies=id_ies, id_curso=id_curso)
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
        return ret


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
        id_grade: str | None,
        id_ies: str,
        serie: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as medidas do boxplot das disciplinas de uma grade em uma série.\n

        :param id_curso(str): Código do curso.
        :param id_grade(str): Código da grade.
        :param id_ies(str): Código da instituição.
        :param serie(int): Série.
        """
        if id_grade:
            query = """
                with disciplinas_serie as (
                    select cod_disc from grad_dis
                    where id_curso = %(id_curso)s
                    and id_ies = %(id_ies)s
                    and serie = %(serie)s
                    and id_grade = %(id_grade)s
                ), 
                query_notas as (
                    select d.nome, d.abreviacao, nota,
                    ntile(4) over (partition by d.nome order by nota) as quartil
                    from historico as h 
                    inner join disciplinas as d on d.cod_disc = h.cod_disc
                    where h.cod_disc in (select * from disciplinas_serie) and h.id_ies = %(id_ies)s
                    and ano_letivo >= (select ano from grades where id_grade = %(id_grade)s and id_ies = %(id_ies)s and id_curso = %(id_curso)s)
                    and nota is not null
                ), 
                query_quartis as (
                    select
                        nome,
                        abreviacao,
                        cast(max(case when quartil = 1 then nota end) as float) as primeiro_quartil,
                        cast(max(case when quartil = 2 then nota end) as float) as segundo_quartil,
                        cast(max(case when quartil = 3 then nota end) as float) as terceiro_quartil,
                        cast(round(stddev_pop(nota), 2) as float) as desvio_padrao,
                        cast(round(avg(nota), 2) as float) as media
                    from query_notas
                    group by nome, abreviacao
                    having MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                    AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                    AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
                )
                select *,
                    GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) as limite_inferior,
                    LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) as limite_superior
                from query_quartis
                order by nome;
            """

            ret = db.fetch_all(
                query=query,
                id_curso=id_curso,
                id_ies=id_ies,
                serie=serie,
                id_grade=id_grade,
            )
            return ret

        query = """
            with ultima_grade as (
                select id_grade, ano from grades where id_curso = %(id_curso)s
                and id_ies = %(id_ies)s
                order by ano desc, semestre desc
                limit 1
            ),
            disciplinas_serie as (
                select cod_disc from grad_dis
                where id_curso = %(id_curso)s
                and id_ies = %(id_ies)s
                and serie = %(serie)s
                and id_grade = (select id_grade from ultima_grade)
            ),
            query_notas as (
                select d.nome, d.abreviacao, nota,
                ntile(4) over (partition by d.nome order by nota) as quartil
                from historico as h 
                inner join disciplinas as d on d.cod_disc = h.cod_disc
                where h.cod_disc in (select * from disciplinas_serie) and h.id_ies = %(id_ies)s
                and ano_letivo >= (select ano from ultima_grade)
                and nota is not null
            ), 
            query_quartis as (
                select
                    nome,
                    abreviacao,
                    cast(max(case when quartil = 1 then nota end) as float) as primeiro_quartil,
                    cast(max(case when quartil = 2 then nota end) as float) as segundo_quartil,
                    cast(max(case when quartil = 3 then nota end) as float) as terceiro_quartil,
                    cast(round(stddev_pop(nota), 2) as float) as desvio_padrao,
                    cast(round(avg(nota), 2) as float) as media
                from query_notas
                group by nome, abreviacao
                having MAX(CASE WHEN quartil = 1 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN nota END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN nota END) IS NOT NULL
            )
            select *,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 0) as limite_inferior,
                LEAST(terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)), 100) as limite_superior
            from query_quartis;
        """

        ret = db.fetch_all(query=query, id_curso=id_curso, id_ies=id_ies, serie=serie)
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
        id_grade: str | None,
        serie: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Retorna as taxas de aprovação e reprovação de uma série.

        :param id_curso(str): Código do Curso
        :param id_ies(str): Código da Instituição
        :param id_grade(str): Código da Grade Curricular
        :param serie(int): Série/Período
        """

        # Executa essa consulta se tiver sido passado uma grade pelos parâmetros
        if id_grade:
            query = """
                with nota_min as (
                    select nota_min_aprovacao from cursos where id = %(id_curso)s and id_ies = %(id_ies)s	
                ),
                disciplinas_grade as (
                    select cod_disc 
                    from grad_dis 
                    where id_curso = %(id_curso)s and id_ies = %(id_ies)s
                    and id_grade = %(id_grade)s and serie = %(serie)s
                ),
                notas_historico as (
                    select 
                        cod_disc,
                        id_ies,
                        nota 
                    from historico 
                    where cod_disc in (select * from disciplinas_grade) 
                    and id_ies = %(id_ies)s
                    and ano_letivo >= (
                        select ano from grades where id_grade = %(id_grade)s and id_ies = %(id_ies)s and id_curso = %(id_curso)s
                    )
                    and nota is not null
                )
                select
                    disciplinas.nome,
                    disciplinas.abreviacao,
                    cast(round(100.0 * SUM(CASE WHEN nota >= (select * from nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) as float) AS taxa_aprovacao,
                    cast(round(100.0 * SUM(CASE WHEN nota < (select * from nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) as float) AS taxa_reprovacao
                from notas_historico
                inner join disciplinas on 
                    disciplinas.cod_disc = notas_historico.cod_disc 
                    and disciplinas.id_ies = notas_historico.id_ies 
                group by
                    disciplinas.nome,
                    disciplinas.abreviacao
                order by disciplinas.nome;
            """

            ret = db.fetch_all(
                query=query,
                id_curso=id_curso,
                id_grade=id_grade,
                id_ies=id_ies,
                serie=serie,
            )

            return ret

        query = """
            with nota_min as (
                select nota_min_aprovacao from cursos where id = %(id_curso)s and id_ies = %(id_ies)s	
            ),
            ultima_grade as (
                select id_grade, ano from grades where id_curso = %(id_curso)s
                and id_ies = %(id_ies)s
                order by ano desc, semestre desc
                limit 1
            ),
            disciplinas_grade as (
                select cod_disc 
                from grad_dis 
                where id_curso = %(id_curso)s and id_ies = %(id_ies)s
                and id_grade = (select id_grade from ultima_grade) and serie = %(serie)s
            ),
            notas_historico as (
                select 
                    cod_disc,
                    id_ies,
                    nota 
                from historico 
                where cod_disc in (select * from disciplinas_grade) 
                and id_ies = %(id_ies)s
                and ano_letivo >= (select ano from ultima_grade)
                and nota is not null
            )
            select
                notas_historico.cod_disc,
                disciplinas.nome,
                disciplinas.abreviacao,
                cast(round(100.0 * SUM(CASE WHEN nota >= (select * from nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) as float) AS taxa_aprovacao,
                cast(round(100.0 * SUM(CASE WHEN nota < (select * from nota_min) THEN 1 ELSE 0 END) / COUNT(*), 2) as float) AS taxa_reprovacao
            from notas_historico
            inner join disciplinas on 
                disciplinas.cod_disc = notas_historico.cod_disc 
                and disciplinas.id_ies = notas_historico.id_ies 
            group by notas_historico.cod_disc,
                disciplinas.nome,
                disciplinas.abreviacao;
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




queries_disciplinas = QueriesDisciplinas()
