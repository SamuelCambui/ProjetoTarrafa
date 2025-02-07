from backend.db.db import DBConnectorGRAD
from backend.core.utils import tratamento_excecao_com_db

class QueriesCursos():

    @tratamento_excecao_com_db(tipo_banco='grad')
    def lista_cursos(self, id_ies: str, db: DBConnectorGRAD = None):
        """
        Retorna todos os cursos de pós-graduação lsy a partir de 10 anos atrás.\n

        :param id_ies(str): Código da Instituição
        """
        query = """
            SELECT cursos.id, nome, tiposcursos.descricao as tipo_curso FROM cursos
            LEFT JOIN curso_tipo on curso_tipo.id_curso = cursos.id AND curso_tipo.id_ies = cursos.id_ies
            LEFT JOIN tiposcursos on tiposcursos.id = curso_tipo.id_tipo
            WHERE curso_tipo.id_tipo in (3,5,6)
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

    @tratamento_excecao_com_db(tipo_banco='grad')
    def retorna_curso(self, id_curso: str, id_ies: str, db: DBConnectorGRAD = None):
        """
        Retorna dados de um curso em específico.

        :param id(str): Código do curso.
        :param id_ies(str): Código da universidade.
        """
        query = """
           select id, id_ies, nome, grau, serie_inicial, serie_final, cast(nota_min_aprovacao as float), cast(freq_min_aprovacao as float) 
           from cursos where id = %(id_curso)s and id_ies = %(id_ies)s
        """
        ret = db.fetch_one(query, id_curso=id_curso, id_ies=id_ies)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def quantidade_alunos_por_semestre(
        self,
        id: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
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


    @tratamento_excecao_com_db(tipo_banco='grad')
    def quantidade_alunos_por_sexo(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
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

    @tratamento_excecao_com_db(tipo_banco='grad')
    def forma_ingresso(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
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

    @tratamento_excecao_com_db(tipo_banco='grad')
    def alunos_necessidade_especial(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
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

    @tratamento_excecao_com_db(tipo_banco='grad')
    def professores(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
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
                ORDER BY h.id_prof, MAX(ano_letivo) DESC
            )
            SELECT 
                id_prof,
                prof.nome,
                prof.qualificacao,
                prof.sexo,
                COALESCE(dep.nome, 'NÃO ESPECIFICADO') as departamento,
                COALESCE(prof.vinculo, 'NÃO ESPECIFICADO') as vinculo,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id_disc', cod_disc,
                        'nome', disciplina,
                        'abreviacao', historico_curso.abreviacao,
                        'ultima_vez_lecionada', ano_letivo
                    )
                ) AS disciplinas
            FROM historico_curso
            INNER JOIN professores AS prof ON prof.id = id_prof
            LEFT JOIN departamentos AS dep ON dep.id_dep = prof.id_dep
            GROUP BY 
                id_prof, 
                prof.nome,
                prof.qualificacao,
                dep.nome,
                prof.vinculo,
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

    # @tratamento_excecao_com_db(tipo_banco='grad')
    # def tempo_formacao(
    #     self,
    #     id_curso: str,
    #     id_ies: str,
    #     anoi: int,
    #     db: DBConnectorGRAD = None,
    # ):
    #     """
    #     Retorna o tempo de formação dos alunos de um curso a partir de determinado ano.\n

    #     :param id_curso(str): Código do curso.
    #     :param id_ies(str): Código da universidade.
    #     :param anoi(int): Ano inicial.
    #     """
    #     query = """
    #         with tempo_conclusao as (
    #             with query_tempo as (
    #                 select age(
    #                     data_colacao,
    #                     data_matricula
    #                 )
    #                 as tempo from aluno_curso
    #                 where id_curso = %(id_curso)s
    #                 and id_ies = %(id_ies)s
    #                 and data_colacao is not null
    #                 and date_part('year', data_colacao) >= %(anoi)s
    #                 order by tempo
    #             ) select (date_part('year', tempo) * 12 + date_part('month', tempo)) / 6 as duracao,
    #                 count((date_part('year', tempo) * 12 + date_part('month', tempo)) / 6) as qtd 
    #                 from query_tempo
    #                 group by duracao
    #         )
    #         select round(duracao) as tempo_formacao, cast(sum(qtd) as integer) as quantidade 
    #         from tempo_conclusao
    #         where duracao is not null and duracao >= 0
    #         group by tempo_formacao
    #         order by tempo_formacao
    #     """
    #     ret = db.fetch_all(query, id_curso=id_curso, anoi=anoi, id_ies=id_ies)
    #     return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def naturalidade_alunos(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
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

  
    @tratamento_excecao_com_db(tipo_banco='grad')
    def boxplot_idade(
        self,
        id_curso: str,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        """
        Distribuição de idade dos ingressantes no curso.

        :param id_curso(str): Código da do curso.
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
                    cast(max(case when quartil = 1 then idade end) as float) as primeiro_quartil,
                    cast(max(case when quartil = 2 then idade end) as float) as segundo_quartil,
                    cast(max(case when quartil = 3 then idade end) as float) as terceiro_quartil,
                    cast(round(avg(idade), 2) as float) as media
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
            query=query, id_curso=id_curso,id_ies=id_ies, anoi=anoi, anof=anof
        )
        
        return ret


    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_por_cor_por_ano(self, id: str,id_ies: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos de cada cor de pele dos cursos e das residências de pós-graduação latu sensu em um determinado periodo 
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT 
                alunos.cor AS COR, 
                COUNT(DISTINCT alunos.matricula) AS NUMERO_ALUNOS, 
                historico.ano_letivo AS ANO
            FROM 
                alunos
            INNER JOIN aluno_curso 
                ON alunos.matricula = aluno_curso.matricula_aluno
            INNER JOIN cursos 
                ON cursos.id = aluno_curso.id_curso
            INNER JOIN historico 
                ON historico.matricula_aluno = alunos.matricula
            WHERE 
                
                cursos.id LIKE %(id_curso)s
                AND cursos.id_ies = %(id_ies)s
                AND CAST(historico.ano_letivo AS INTEGER) between %(anoi)s and %(anof)s
                AND alunos.cor IS NOT NULL 
                AND alunos.cor NOT IN ('N', '0')
            GROUP BY 
                alunos.cor, 
                historico.ano_letivo
            ORDER BY 
                historico.ano_letivo, 
                alunos.cor;

        """

        ret = db.fetch_all(query, id=id, id_ies=id_ies, anoi=anoi, anof=anof)
        return ret
    
  
   

    # @tratamento_excecao_com_db(tipo_banco='grad')
    # def quant_alu_grad_e_posgra(self, db: DBConnectorGRAD = None):
    #     """
    #     Retorna a quantidade de alunos que fizeram graduação e pós graduação e a quantidade de alunos que fizeram apenas graduação

    #     """
    #     query = """

    #     WITH curso_counts AS (
    #         SELECT aluno_curso."matricula_aluno", COUNT(*) AS total_registros, SUM(CASE WHEN cursos."grau" = 3 THEN 1 ELSE 0 END) AS count_grau_3, SUM(CASE WHEN cursos."grau" = 4 THEN 1 ELSE 0 END) AS count_grau_4
    #         FROM aluno_curso
    #         INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
    #         GROUP BY aluno_curso."matricula_aluno"
    #     )
    #     SELECT 'Graduacao_e_Pos' AS tipo, COUNT(DISTINCT aluno_curso."matricula_aluno") AS total_matriculas
    #     FROM aluno_curso
    #     INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
    #     INNER JOIN curso_counts ON curso_counts."matricula_aluno" = aluno_curso."matricula_aluno"
    #     WHERE aluno_curso."matricula_aluno" IN (
    #         SELECT matricula_aluno
    #         FROM curso_counts
    #         WHERE count_grau_3 >= 1  -- Pelo menos um curso de graduação (grau 3)
    #         AND count_grau_4 >= 1   -- Pelo menos um curso de pós-graduação (grau 4)
    #     )
    #     UNION ALL
    #     SELECT 'Apenas_Graduacao' AS tipo, COUNT(DISTINCT aluno_curso."matricula_aluno") AS total_matriculas
    #     FROM aluno_curso
    #     INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
    #     INNER JOIN curso_counts ON curso_counts."matricula_aluno" = aluno_curso."matricula_aluno"
    #     WHERE aluno_curso."matricula_aluno" IN (
    #         SELECT matricula_aluno
    #         FROM curso_counts
    #         WHERE total_registros = count_grau_3  -- Todos os registros são de grau 3 (graduação)
    #         AND count_grau_4 = 0                -- Não há nenhum registro de grau 4 (pós-graduação)
    #     );

    #     """

    #     ret = db.fetch_all(query, id=id)
    #     return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_vieram_gradu_e_nao_vieram_por_curso(self, id: str,id_ies: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos que vieram de cada curso da graduação em um determinado curso de pós graduação latu sensu em um determinado curso
        
        Parâmetros:
            id(str): Código do curso.
        """
        query = """

        WITH primeira_consulta AS (
            SELECT 
                DISTINCT 
                EXTRACT(YEAR FROM ac.data_matricula) AS ano_matricula,  -- Ano da matrícula
                ac.matricula_aluno AS matricula,
                CASE 
                    WHEN EXISTS (
                        SELECT 1
                        FROM historico h
                        JOIN aluno_curso ac2 ON h.id_aluno_curso = ac2.id
                        JOIN cursos c2 ON ac2.id_curso = c2.id
                        JOIN curso_tipo ct2 ON c2.id = ct2.id_curso
                        WHERE h.matricula_aluno = ac.matricula_aluno
                        AND ct2.id_tipo = 1 -- Tipo 1 indica graduação
                    ) THEN 'Graduação'
                    ELSE 'Não Graduação'
                END AS tipo_curso
            FROM 
                aluno_curso ac
            JOIN 
                cursos c ON ac.id_curso = c.id
            JOIN 
                curso_tipo ct ON c.id = ct.id_curso
            WHERE 
                EXTRACT(YEAR FROM ac.data_matricula) between %(anoi)s and %(anof)s  -- Ano de matrícula desejado
                AND c.id = %(id)s
                AND c.id_ies = %(id_ies)s
        ),
        curso_graduacao AS (
            SELECT 
                DISTINCT
                h.matricula_aluno AS matricula,
                c.nome AS nome_curso_graduacao,
                MAX(ac.data_matricula) AS ultima_data_graduacao -- Última matrícula registrada do curso de graduação
            FROM 
                historico h
            JOIN 
                aluno_curso ac ON h.id_aluno_curso = ac.id
            JOIN 
                cursos c ON ac.id_curso = c.id
            JOIN 
                curso_tipo ct ON c.id = ct.id_curso
            WHERE 
                ct.id_tipo = 1 -- Tipo 1 indica graduação
            GROUP BY 
                h.matricula_aluno, c.nome
        )
        SELECT 
            pc.ano_matricula,
            COALESCE(cg.nome_curso_graduacao, 'Não Fizeram Nenhum Curso de Graduação na Unimontes') AS nome_curso_graduacao,
            COUNT(pc.matricula) AS quantidade_matriculas -- Contagem de matrículas por curso
        FROM 
            primeira_consulta pc
        LEFT JOIN 
            curso_graduacao cg ON pc.matricula = cg.matricula
        GROUP BY 
            pc.ano_matricula, COALESCE(cg.nome_curso_graduacao, 'Não Há')
        ORDER BY 
            pc.ano_matricula, quantidade_matriculas DESC;
        """

        ret = db.fetch_all(query, id=id, id_ies=id_ies, anoi=anoi, anof=anof)
        dados = [dict(r) for r in ret]
        return dados
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def grades(self, id_curso: str, id_ies: str, db: DBConnectorGRAD = None):
        """
        Retorna todas as grades de um curso.

        :param id_curso(str): Código do curso.
        :param id_ies(str): Código da universidade.
        """
        query = """
            select id_grade, ano || '/' || semestre as semestre_letivo from grades 
            where id_curso = %(id_curso)s and id_ies = %(id_ies)s
            order by semestre_letivo desc
        """
        ret = db.fetch_all(query, id_curso=id_curso, id_ies=id_ies)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def taxa_matriculas(
        self,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        query = """
            select alunos.sexo, date_part('year', data_matricula) as ano_ingresso, count(*) as quantidade 
            from aluno_curso
            inner join alunos on aluno_curso.matricula_aluno = alunos.matricula and aluno_curso.id_ies = alunos.id_ies
            where date_part('year', data_matricula) between %(anoi)s and %(anof)s
            and alunos.id_ies = %(id_ies)s
            group by sexo, date_part('year', data_matricula)
            order by date_part('year', data_matricula)
        """

        ret = db.fetch_all(
            query=query,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def taxa_matriculas_por_cota(
        self,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        query = """
            select
                formasingresso.cota, 
                date_part('year', data_matricula) || '/' ||
                (CASE
                    when date_part('month', data_matricula) <= 6 THEN 1
                    else 2
                END) as semestre_letivo,
                count(*) as quantidade
            from aluno_curso
            left join formasingresso on formasingresso.id = aluno_curso.id_forma_ing and formasingresso.id_ies = aluno_curso.id_ies
            where date_part('year', data_matricula) between %(anoi)s and %(anof)s
            and aluno_curso.id_ies = %(id_ies)s
            and cota is not null
            group by cota, date_part('year', data_matricula), semestre_letivo
            order by date_part('year', data_matricula)
        """
        ret = db.fetch_all(
            query=query,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )
        return ret




    
    # @tratamento_excecao_com_db(tipo_banco='grad')
    # def temp_med_conclu_por_curso(self, id: str, db: DBConnectorGRAD = None):
    #     """
    #     Retorna o tempo medio de conclusao determinado curso de pós graduação latu sensu em meses
    #     Parâmetros:
    #         id(str): Código do curso.
    #     """
    #     query = """

    #     WITH subquery AS (
    #         SELECT DISTINCT
    #             historico."ano_letivo" AS ANO, 
    #             historico."semestre" AS SEMESTRE, 
    #             alunos."matricula" AS MATRI, 
    #             alunos."anoingresso" AS ANOINGRESSO
    #         FROM alunos
    #         INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
    #         INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
    #         INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
    #         INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
    #         WHERE cursos."id" LIKE %(id)s
    #         AND historico."turma" IS NOT NULL
    #     )
    #     , quantidade_por_matricula AS (
    #         SELECT 
    #             MATRI, 
    #             ROUND(COUNT(*) * 6.0, 2) AS QUANTIDADE -- multiplicando por 6 para obter em meses
    #         FROM subquery
    #         GROUP BY MATRI
    #     )
    #     SELECT 
    #         ROUND(AVG(QUANTIDADE), 2) AS MEDIA_QUANTIDADE_MESES -- Média em meses
    #     FROM quantidade_por_matricula;
    #     """

    #     ret = db.fetch_all(query, id=id)
    #     return ret

queries_cursos = QueriesCursos()
