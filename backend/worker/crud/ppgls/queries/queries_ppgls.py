from backend.core import utils
from backend.db.db import DBConnectorGRAD
from backend.core.utils import tratamento_excecao_db_grad

class QueriesPPGLS:
   

    @tratamento_excecao_db_grad()
    def naturalidade_alunos(
        self,
        anoi: int,
        anof: int,
        id_ies: str,
        db: DBConnectorGRAD = None,
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

    @tratamento_excecao_db_grad()
    def sexo_alunos(self, anoi: int, anof: int, id_ies: str, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos do sexo masculino e feminino.
        """
        query = """
            WITH cursos_graduacao as (
                select id_curso from curso_tipo where id_tipo in (1, 2, 10) and id_ies = %(id_ies)s
            )
            select (case when sexo = 'F' then 'Feminino' else 'Masculino' end) as sexo, 
                ano_letivo || '/' || semestre as semestre_letivo, 
                count(*) as quantidade 
            from ( 
                select 
                    distinct h.matricula_aluno, 
                    alunos.sexo, 
                    ano_letivo, 
                    (case 
                        when semestre < 1 then 1
                        when semestre > 2 then 2
                        else semestre
                    end) as semestre
                from historico as h
                inner join alunos on alunos.matricula = h.matricula_aluno and alunos.id_ies = h.id_ies
                inner join aluno_curso as al on al.id = h.id_aluno_curso and al.id_ies = h.id_ies
                where h.id_ies = %(id_ies)s
                and cast(h.ano_letivo as integer) between %(anoi)s and %(anof)s
                and al.id_curso in (select * from cursos_graduacao)
                order by ano_letivo, semestre
            ) as foo
            group by sexo, ano_letivo, semestre
            order by ano_letivo
        """
        ret = db.fetch_all(query, anoi=anoi, anof=anof, id_ies=id_ies)
        return ret

    

    @tratamento_excecao_db_grad()
    def boxplot_idade(self, id_ies: str, anoi: int, anof: int, db: DBConnectorGRAD):
        """
        Retorna as medidas do boxplot para a variável idade de todos os cursos de Graduação ou Licenciatura.

        :param id_ies(str): Código da Instituição.
        :param anoi(int): Ano Inicial.
        :param anof(int): Ano Final.
        """
        query = """
            with query_idades as (
                select 
                    round((data_matricula - data_nascimento)/365, 0) as idade, 
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

    @tratamento_excecao_db_grad()
    def taxa_matriculas(
        self,
        id_ies: str,
        anoi: int,
        anof: int,
        db: DBConnectorGRAD = None,
    ):
        query = """
            select
                (case when alunos.sexo = 'F' then 'Feminino' else 'Masculino' end) as sexo, 
                date_part('year', data_matricula) || '/' ||
                (CASE
                    when date_part('month', data_matricula) <= 6 THEN 1
                    else 2
                END) as semestre_letivo,
                count(*) as quantidade
            from aluno_curso
            inner join alunos on aluno_curso.matricula_aluno = alunos.matricula and aluno_curso.id_ies = alunos.id_ies
            where date_part('year', data_matricula) between %(anoi)s and %(anof)s
            and alunos.id_ies = %(id_ies)s
            group by sexo, date_part('year', data_matricula), semestre_letivo
            order by date_part('year', data_matricula)
        """

        ret = db.fetch_all(
            query=query,
            id_ies=id_ies,
            anoi=anoi,
            anof=anof,
        )

        return ret
    
    @tratamento_excecao_db_grad()
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

queries_ppgls = QueriesPPGLS()
