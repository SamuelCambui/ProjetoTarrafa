from backend.core import utils
from backend.db.db import DBConnector

class QueriesGrad:
    def inserir_usuarios_formulario(self, db: DBConnector, **kwargs):
        query = utils.InsertQuery("formulario", **kwargs)
        ret = db.insert(query, **kwargs)
        if ret:
            return True
        return False

    def verifica_pendencia_formulario(self, cpf: str, db: DBConnector):
        ret = db.fetch_one("""select * from formulario where cpf = %(cpf)s""", cpf=cpf)
        if ret:
            return False
        return True

    @utils.tratamento_excecao_db_grad()
    def naturalidade_alunos(
        self,
        anoi: int,
        anof: int,
        id_ies: str,
        db: DBConnector = None,
    ):
        """
        Retorna os municípios de nascimento dos alunos e a quantidade de cada.
        """
        query = """
            select m.nome as naturalidade, count(cod_municipio_nasc) as quantidade_alunos, m.latitude, m.longitude, e.uf as estado from alunos
            inner join municipios as m on m.codigo_ibge = cast(cod_municipio_nasc as integer)
            inner join aluno_curso as al on al.matricula_aluno = matricula
            inner join estados as e on e.codigo_uf = m.codigo_uf
            where matricula in (
                select distinct matricula_aluno from historico
                where cast(ano_letivo as integer) between %(anoi)s and %(anof)s
                and id_ies = %(id_ies)s
            )
            group by m.nome, m.latitude, m.longitude, e.uf
            order by quantidade_alunos desc
        """
        ret = db.fetch_all(query, anoi=anoi, anof=anof, id_ies=id_ies)
        return ret

    @utils.tratamento_excecao_db_grad()
    def sexo_alunos(self, anoi: int, anof: int, id_ies: str, db: DBConnector = None):
        """
        Retorna a quantidade de alunos do sexo masculino e feminino.
        """
        query = """
            select sexo, count(sexo) as quantidade from alunos
            where matricula in (
                select distinct matricula_aluno from historico
                where cast(ano_letivo as integer) between %(anoi)s and %(anof)s
                and id_ies = %(id_ies)s
            )
            group by sexo
            order by sexo;
        """
        ret = db.fetch_all(query, anoi=anoi, anof=anof, id_ies=id_ies)
        return ret

    @utils.tratamento_excecao_db_grad()
    def egressos(self, anoi: int, anof: int, id_ies: str, db: DBConnector = None):
        query = """
            select cast(date_part('year', data_colacao) as integer) as ano_letivo, 
            case
                when date_part('month', data_colacao) <= 6 then 1
                else 2
            end as semestre,
            count(*) as egressos
            from aluno_curso
            where data_colacao is not null
            and date_part('year', data_colacao) between %(anoi)s and %(anof)s
            and id_ies = %(id_ies)s
            group by ano_letivo, semestre
            order by ano_letivo, semestre
        """

        ret = db.fetch_all(query, anoi=anoi, anof=anof, id_ies=id_ies)
        return ret

    @utils.tratamento_excecao_db_grad()
    def boxplot_idade(self, id_ies: str, anoi: int, anof: int, db: DBConnector):
        """
        Retorna as medidas do boxplot para a variável idade de todos os cursos de Graduação ou Licenciatura.

        :param id_ies(str): Código da Instituição.
        :param anoi(int): Ano Inicial.
        :param anof(int): Ano Final.
        """
        query = """
            with query_idades as (
                select 
                    (data_matricula - data_nascimento)/365 as idade, 
                    date_part('year', data_matricula) as ano_ingresso,
                    ntile(4) over (partition by date_part('year', data_matricula) order by (data_matricula - data_nascimento)/365) as quartil
                from alunos
                left join aluno_curso on aluno_curso.matricula_aluno = alunos.matricula and aluno_curso.id_ies = alunos.id_ies
                where alunos.id_ies = %(id_ies)s
                and id_curso in (select id_curso from curso_tipo where id_ies = %(id_ies)s and id_tipo in (1, 2, 10))
                and date_part('year', data_matricula) between %(anoi)s and %(anof)s
            ), 
            query_quartis as (
                select
                    ano_ingresso,
                    cast(max(case when quartil = 1 then idade end) as float) as primeiro_quartil,
                    cast(max(case when quartil = 2 then idade end) as float) as segundo_quartil,
                    cast(max(case when quartil = 3 then idade end) as float) as terceiro_quartil,
                    cast(round(stddev_pop(idade), 2) as float) as desvio_padrao,
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

        ret = db.fetch_all(query=query, id_ies=id_ies, anoi=anoi, anof=anof)
        return ret

    @utils.tratamento_excecao_db_grad()
    def taxa_matriculas(
        self,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnector = None,
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


queries_grad = QueriesGrad()
