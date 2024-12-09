from backend.db.db import DBConnector
from backend.core.utils import tratamento_excessao_db_grad


class QueriesCursos:
    @tratamento_excessao_db_grad()
    def lista_cursos(self, id_ies: str, db: DBConnector = None):
        """
        Retorna todos os cursos de graduação(Bacharelado, Licenciatura) a partir de 10 anos atrás.\n

        :param id_ies(str): Código da Instituição
        """
        query = """
            SELECT cursos.id, nome, tiposcursos.descricao as tipo_curso FROM cursos
            LEFT JOIN curso_tipo on curso_tipo.id_curso = cursos.id AND curso_tipo.id_ies = cursos.id_ies
            LEFT JOIN tiposcursos on tiposcursos.id = curso_tipo.id_tipo
            WHERE curso_tipo.id_tipo in (1,2,10)
            AND cursos.id IN (
                SELECT distinct aluno_curso.id_curso FROM historico AS h
                INNER JOIN aluno_curso ON aluno_curso.id = h.id_aluno_curso AND aluno_curso.id_ies = h.id_ies
                WHERE CAST(h.ano_letivo AS integer) BETWEEN date_part('year', CURRENT_DATE) - 10 AND date_part('year', CURRENT_DATE)
                AND h.id_ies = %(id_ies)s
            )
            AND cursos.id_ies = %(id_ies)s
            ORDER BY nome;
        """
        ret = db.fetch_all(query=query, id_ies=id_ies)
        return ret

    @tratamento_excessao_db_grad()
    def retorna_curso(self, id: str, id_ies: str, db: DBConnector = None):
        """
        Retorna dados de um curso em específico.

        :param id(str): Código do curso.
        :param id_ies(str): Código da universidade.
        """
        query = """
           select id, id_ies, nome, grau, serie_inicial, serie_final, cast(nota_min_aprovacao as float), cast(freq_min_aprovacao as float) 
           from cursos where id = %(id)s and id_ies = %(id_ies)s
        """
        ret = db.fetch_one(query, id=id, id_ies=id_ies)
        return ret

    @tratamento_excessao_db_grad()
    def quantidade_alunos_por_semestre(
        self,
        id: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
    ):
        """
        Retorna a quantidade de alunos por semestre de um curso ao longo do tempo a partir de um ano inicial.\n

        :param id(str): Código do curso.
        :param id_ies(str): Código da instituição.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano Final.
        """
        query = """
            SELECT foo.ano_letivo, foo.semestre, COUNT(*) AS quantidade FROM ( 
                SELECT historico.ano_letivo, historico.semestre FROM historico 
                INNER JOIN aluno_curso ON aluno_curso.id = historico.id_aluno_curso AND aluno_curso.id_ies = historico.id_ies	
                WHERE aluno_curso.id_curso = %(id)s AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                AND historico.id_ies = %(id_ies)s
                GROUP BY historico.matricula_aluno, historico.ano_letivo, historico.semestre
                ORDER BY historico.ano_letivo, historico.semestre
            ) AS foo
            GROUP BY foo.ano_letivo, foo.semestre
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof, id_ies=id_ies)
        return ret

    @tratamento_excessao_db_grad()
    def egressos(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
    ):
        """
        Retorna a quantidade de egressos de um curso por semestre em determinado período.

        :param id_curso(str): Código do curso.
        :param id_ies(str): Código da Universidade.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano final.
        """
        query = """
            SELECT count(*) as egressos, CAST(date_part('year', data_colacao) as integer) as ano_letivo,
            CASE 
                WHEN date_part('month', data_colacao) <= 6 THEN 1
                WHEN date_part('month', data_colacao) > 6 THEN 2
            END
            AS semestre
            FROM aluno_curso 
            WHERE id_curso = %(id_curso)s AND
            date_part('year', data_colacao) BETWEEN %(anoi)s AND %(anof)s
            AND id_ies = %(id_ies)s
            GROUP BY ano_letivo, semestre
            ORDER BY ano_letivo, semestre;
        """
        ret = db.fetch_all(
            query,
            id_curso=id_curso,
            anoi=anoi,
            anof=anof,
            id_ies=id_ies,
        )
        return ret

    @tratamento_excessao_db_grad()
    def quantidade_alunos_por_sexo(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
    ):
        """
        Retorna a quantidade de alunos do sexo feminino e masculino, por semestre, de um curso.\n

        :param id(str): Código do curso.
        :param id_ies(str): Código da instituição.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano final.
        """
        query = """
            select sexo, ano_letivo, semestre, count(sexo) as quantidade from ( 
                select distinct h.matricula_aluno, alunos.sexo, ano_letivo, semestre from historico as h
                inner join alunos on alunos.matricula = h.matricula_aluno and alunos.id_ies = h.id_ies
                inner join aluno_curso as al on al.id = h.id_aluno_curso and al.id_ies = h.id_ies
                where al.id_curso = %(id_curso)s
                and h.id_ies = %(id_ies)s
                and cast(h.ano_letivo as integer) between %(anoi)s and %(anof)s
                order by ano_letivo, semestre
            ) as foo
            group by sexo, ano_letivo, semestre
            order by ano_letivo
        """
        ret = db.fetch_all(
            query,
            id_curso=id_curso,
            anoi=anoi,
            anof=anof,
            id_ies=id_ies,
        )
        return ret

    @tratamento_excessao_db_grad()
    def forma_ingresso(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
    ):
        """
        Retorna a quantidade de alunos ingressantes por cada modalidade de forma de ingresso.\n

        :param id(str): Código do curso.
        :param id_ies(str): Código da universidade.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano final.
        """
        query = """
            select fi.id, fi.descricao, count(al.id_forma_ing) as quantidade, cota
            from aluno_curso as al
            inner join formasingresso as fi on fi.id = al.id_forma_ing
            where al.id_curso = %(id_curso)s
            and al.id_ies = %(id_ies)s
            and cast(al.ano_admissao as integer) between %(anoi)s and %(anof)s 
            group by fi.id, fi.descricao, cota;
        """
        ret = db.fetch_all(
            query,
            id_curso=id_curso,
            anoi=anoi,
            anof=anof,
            id_ies=id_ies,
        )
        return ret

    @tratamento_excessao_db_grad()
    def alunos_necessidade_especial(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
    ):
        """
        Retorna a necessidade especial e a quantidade de alunos que a tem, por curso. \n

        :param id(str): Código do curso.
        :param id_ies(str): Código da universidade.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano final.
        """
        query = """
            select foo.neceespecial, count(*) as quantidade from (
                select distinct h.matricula_aluno, al.neceespecial from historico as h
                inner join alunos as al on al.matricula = h.matricula_aluno
                inner join aluno_curso as ac on ac.id = h.id_aluno_curso
                where al.neceespecial is not null
                and ac.id_curso = %(id_curso)s
                and h.id_ies = %(id_ies)s
                and cast(h.ano_letivo as integer) between %(anoi)s and %(anof)s
            ) as foo
            group by foo.neceespecial;
        """
        ret = db.fetch_all(
            query,
            id_curso=id_curso,
            anoi=anoi,
            anof=anof,
            id_ies=id_ies,
        )
        return ret

    @tratamento_excessao_db_grad()
    def professores(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
    ):
        """
        Retorna os professores de um curso.\n

        :param id(str): Código do curso.
        :param id_ies(str): Código da universidade.
        :param anoi(int): Ano Inicial
        :param anof(int): Ano Final
        """
        query = """
            WITH disciplinas_curso AS (
                SELECT DISTINCT cod_disc 
                FROM grad_dis 
                WHERE id_curso = %(id_curso)s AND id_ies = %(id_ies)s
            ),
            historico_curso AS (
                SELECT DISTINCT h.id_prof, dis.cod_disc, dis.nome as disciplina, dis.abreviacao, MAX(ano_letivo) as ano_letivo
                FROM historico AS h
                INNER JOIN aluno_curso AS ac 
                    ON ac.id = h.id_aluno_curso AND ac.id_ies = h.id_ies
                INNER JOIN disciplinas AS dis
                    ON dis.cod_disc = h.cod_disc AND dis.id_ies = ac.id_ies
                WHERE ac.id_curso = %(id_curso)s AND h.id_ies = %(id_ies)s
                    AND h.cod_disc IN (SELECT cod_disc FROM disciplinas_curso)
                    AND cast(ano_letivo as integer) between %(anoi)s and %(anof)s
                GROUP BY h.id_prof, dis.cod_disc, dis.nome, dis.abreviacao
            )
            SELECT 
                id_prof,
                prof.nome,
                prof.qualificacao,
                prof.sexo,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id_disc', cod_disc,
                        'nome', disciplina,
                        'abreviacao', abreviacao,
                        'ultima_vez_lecionada', ano_letivo
                    )
                ) AS disciplinas
            FROM historico_curso
            INNER JOIN professores AS prof ON prof.id = id_prof
            GROUP BY 
                id_prof, 
                prof.nome,
                prof.qualificacao,
                prof.sexo;

        """
        ret = db.fetch_all(
            query,
            id_curso=id_curso,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        return ret

    @tratamento_excessao_db_grad()
    def tempo_formacao(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        db: DBConnector = None,
    ):
        """
        Retorna o tempo de formação dos alunos de um curso a partir de determinado ano.\n

        :param id_curso(str): Código do curso.
        :param id_ies(str): Código da universidade.
        :param anoi(int): Ano inicial.
        """
        query = """
            with tempo_conclusao as (
                with query_tempo as (
                    select age(
                        data_colacao,
                        data_matricula
                    )
                    as tempo from aluno_curso
                    where id_curso = %(id_curso)s
                    and id_ies = %(id_ies)s
                    and data_colacao is not null
                    and date_part('year', data_colacao) >= %(anoi)s
                    order by tempo
                ) select (date_part('year', tempo) * 12 + date_part('month', tempo)) / 6 as duracao,
                    count((date_part('year', tempo) * 12 + date_part('month', tempo)) / 6) as qtd 
                    from query_tempo
                    group by duracao
            )
            select round(duracao) as tempo_formacao, cast(sum(qtd) as integer) as quantidade 
            from tempo_conclusao
            where duracao is not null and duracao >= 0
            group by tempo_formacao
            order by tempo_formacao
        """
        ret = db.fetch_all(query, id_curso=id_curso, anoi=anoi, id_ies=id_ies)
        return ret

    @tratamento_excessao_db_grad()
    def naturalidade_alunos(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
    ):
        """
        Retorna os municípios de nascimento dos alunos de um curso.\n

        :param id(str): Código do curso.
        :param id_ies(str): Código da universidade.
        :param anoi(int): Ano Inicial.
        :param anof(int): Ano Final.
        """
        query = """
            with alunos_curso as (
                select distinct historico.matricula_aluno from historico
                inner join aluno_curso on aluno_curso.id = historico.id_aluno_curso and aluno_curso.id_ies = historico.id_ies
                where cast(ano_letivo as integer) between %(anoi)s and %(anof)s
                and historico.id_ies = %(id_ies)s and aluno_curso.id_curso = %(id_curso)s
            )
            select m.nome as naturalidade, count(cod_municipio_nasc) as quantidade_alunos, m.latitude, m.longitude, e.uf as estado 
            from alunos
            inner join municipios as m on m.codigo_ibge = cast(cod_municipio_nasc as integer)
            inner join aluno_curso as al on al.matricula_aluno = matricula
            inner join estados as e on e.codigo_uf = m.codigo_uf
            where al.id_curso = %(id_curso)s
            and al.id_ies = %(id_ies)s
            and matricula in (select * from alunos_curso)
            group by m.nome, m.latitude, m.longitude, e.uf
            order by quantidade_alunos desc
        """
        ret = db.fetch_all(
            query, id_curso=id_curso, anoi=anoi, anof=anof, id_ies=id_ies
        )
        return ret

    #   TESTE
    @tratamento_excessao_db_grad()
    def boxplot_idade(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
    ):
        """
        Distribuição de idade dos ingressantes no curso.

        :param id_curso(str): Código do curso.
        :param id_ies(str): Código da instituição.
        :param anoi(int): Ano inicial.
        :param anof(int): Ano final.
        """
        query = """
            with query_idades as (
                select 
                    (data_matricula - data_nascimento)/365 as idade, 
                    date_part('year', data_matricula) as ano_ingresso,
                    ntile(4) over (partition by date_part('year', data_matricula) order by (data_matricula - data_nascimento)/365) as quartil
                from alunos
                left join aluno_curso on aluno_curso.matricula_aluno = alunos.matricula and aluno_curso.id_ies = alunos.id_ies
                where id_curso = %(id_curso)s and alunos.id_ies = %(id_ies)s
                and date_part('year', data_matricula) between %(anoi)s and %(anof)s
            ), 
            query_quartis as (
                select
                    ano_ingresso,
                    max(case when quartil = 1 then idade end) as primeiro_quartil,
                    max(case when quartil = 2 then idade end) as segundo_quartil,
                    max(case when quartil = 3 then idade end) as terceiro_quartil,
                    round(avg(idade), 2) as media
                from query_idades
                group by ano_ingresso
                having MAX(CASE WHEN quartil = 1 THEN idade END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 2 THEN idade END) IS NOT NULL
                AND MAX(CASE WHEN quartil = 3 THEN idade END) IS NOT NULL
            )
            select *,
                GREATEST(primeiro_quartil - (1.5 * (terceiro_quartil - primeiro_quartil)), 17) as limite_inferior,
                terceiro_quartil + (1.5 * (terceiro_quartil - primeiro_quartil)) as limite_superior
            from query_quartis
            order by ano_ingresso;
        """

        ret = db.fetch_all(
            query=query, id_curso=id_curso, id_ies=id_ies, anoi=anoi, anof=anof
        )
        return ret


queries_cursos = QueriesCursos()
