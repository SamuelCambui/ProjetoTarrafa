from backend.db.db import DBConnectorGRAD
from backend.core.utils import tratamento_excecao_com_db

class QueriesCursos():
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def lista_cursos(self, db: DBConnectorGRAD = None):
        """
        Retorna todos os cursos de pós graduação latu sensu a partir de 10 anos atrás.
        """
        query= """
            SELECT cursos.id, nome, modalidade, habilita.descricao as habilita FROM cursos
            INNER JOIN habilita ON cursos.cod_habilita = habilita.id
            WHERE cod_habilita in (7)
            AND cursos.id IN (
                SELECT d.cod_curso FROM historico AS h
                INNER JOIN disciplinas AS d ON h.cod_disc = d.cod_disc
                WHERE CAST(h.ano_letivo AS integer) BETWEEN date_part('year', CURRENT_DATE) - 10 AND date_part('year', CURRENT_DATE)
            )
            ORDER BY nome;
        """
        ret = db.fetch_all(query=query)
        return ret
    
    

    @tratamento_excecao_com_db(tipo_banco='grad')
    def retorna_curso(self, id: str, db: DBConnectorGRAD = None):
        """
        Retorna dados de um curso em específico.

        Parâmetros:
            id(str): Código do curso.
        """
        query = """
            SELECT cursos.id, nome, serie_final, serie_inicial, modalidade, habilita.descricao as habilita FROM cursos
            INNER JOIN habilita ON cursos.cod_habilita = habilita.id
            WHERE cursos.id=%(id)s
        """
        ret = db.fetch_one(query, id=id)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quantidade_alunos_por_semestre(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos por semestre de um curso ao longo do tempo a partir de um ano inicial.

        Parâmetros:
            id(str): Código do curso.
            ano(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            SELECT foo.ano_letivo, foo.semestre, COUNT(foo.ano_letivo) AS quantidade FROM ( 
                SELECT historico.ano_letivo, historico.semestre FROM historico 
                INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc	
                WHERE disciplinas.cod_curso= %(id)s AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                GROUP BY matricula_aluno, historico.ano_letivo, historico.semestre
                ORDER BY historico.ano_letivo, historico.semestre
            ) AS foo
            GROUP BY foo.ano_letivo, foo.semestre
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def media_idades_por_ano(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a media das idades dos alunos de um curso de pós-graduação latu sensu por semestre em um determinado periodo

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            SELECT historico."ano_letivo" AS ANO, historico."semestre" AS SEMESTRE,
            ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, alunos."data_nascimento")))::numeric, 2) AS MEDIA_IDADE
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE 
                cursos."id" LIKE %(id)s
                AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY historico."ano_letivo", historico."semestre"
            ORDER BY historico."ano_letivo", historico."semestre";
	
        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_e_alunas_por_semestre(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos homens e mulhes de um curso de pós-graduação latu sensu em um determinado periodo

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
     
            SELECT 
                historico."ano_letivo" AS ANO, 
                CASE 
                    WHEN historico."semestre" = 0 THEN 1 
                    ELSE historico."semestre" 
                END AS SEMESTRE, 
                alunos."sexo" AS SEXO, 
                COUNT(DISTINCT alunos."matricula") AS QUANTIDADE
            FROM 
                alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE 
                cursos."id" LIKE %(id)s
                AND historico."ano_letivo" BETWEEN %(anoi)s AND %(anof)s
            GROUP BY historico."ano_letivo", historico."semestre", alunos."sexo"
            ORDER BY historico."ano_letivo", historico."semestre";
        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def nota_media_por_semestre(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a nota média de um curso em um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT historico.ano_letivo, 
            CASE 
                WHEN historico.semestre = 0 THEN 1 
                ELSE historico.semestre 
            END AS semestre, 
            round(AVG(nota), 2) AS media 
            FROM historico
            INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc
            INNER JOIN cursos ON cursos.id = disciplinas.cod_curso
            WHERE 
                disciplinas.cod_curso = %(id)s
                AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
            GROUP BY historico.ano_letivo, historico.semestre
            HAVING AVG(nota) IS NOT NULL
            ORDER BY historico.ano_letivo, semestre;


        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def nota_media_por_curso_por_semestre(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):

        """
        Retorna a média das notas de um semestre por ano de um curso de pós-graduação latu sensu em um determinado período.
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            SELECT historico.ano_letivo, historico.semestre, ROUND(AVG(nota), 2) AS media
            FROM historico
            INNER JOIN disciplinas ON disciplinas."cod_disc" = historico."cod_disc"
            INNER JOIN cursos ON cursos."id" = disciplinas."cod_curso"
            WHERE disciplinas.cod_curso = %(id)s AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
            GROUP BY historico.ano_letivo, historico.semestre, historico.turma
            HAVING AVG(nota) IS NOT NULL
            ORDER BY historico.ano_letivo, historico.semestre, historico.turma;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_curso_por_modali_por_ano(self, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de cursos por modalidade em um determinado periodo de ano 
        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT cursos."modalidade" AS MODALIDADE,historico."ano_letivo" AS ANO, COUNT(DISTINCT cursos."nome") AS QTD_ESPECIALIZACOES
            FROM cursos
            INNER JOIN aluno_curso ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."nome" LIKE 'PÓS-GRADUAÇÃO LATO SENSU %'
            AND cursos."modalidade" != ''
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY cursos."modalidade", historico."ano_letivo"
            ORDER BY historico."ano_letivo";

        """

        ret = db.fetch_all(query, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_resi_por_modali_por_ano(self, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de residências por modalidade em um determinado periodo de ano 
        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT cursos."modalidade" AS MODALIDADE,historico."ano_letivo" AS ANO, COUNT(DISTINCT cursos."nome") AS QTD_ESPECIALIZACOES
            FROM cursos
            INNER JOIN aluno_curso ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."nome" LIKE 'RESI%'
            AND cursos."modalidade" != ''
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY cursos."modalidade", historico."ano_letivo"
            ORDER BY historico."ano_letivo";

        """

        ret = db.fetch_all(query, anoi=anoi, anof=anof)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alu_grad_e_posgra(self, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos que fizeram graduação e pós graduação e a quantidade de alunos que fizeram apenas graduação

        """
        query = """

        WITH curso_counts AS (
            SELECT aluno_curso."matricula_aluno", COUNT(*) AS total_registros, SUM(CASE WHEN cursos."grau" = 3 THEN 1 ELSE 0 END) AS count_grau_3, SUM(CASE WHEN cursos."grau" = 4 THEN 1 ELSE 0 END) AS count_grau_4
            FROM aluno_curso
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            GROUP BY aluno_curso."matricula_aluno"
        )
        SELECT 'Graduacao_e_Pos' AS tipo, COUNT(DISTINCT aluno_curso."matricula_aluno") AS total_matriculas
        FROM aluno_curso
        INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
        INNER JOIN curso_counts ON curso_counts."matricula_aluno" = aluno_curso."matricula_aluno"
        WHERE aluno_curso."matricula_aluno" IN (
            SELECT matricula_aluno
            FROM curso_counts
            WHERE count_grau_3 >= 1  -- Pelo menos um curso de graduação (grau 3)
            AND count_grau_4 >= 1   -- Pelo menos um curso de pós-graduação (grau 4)
        )
        UNION ALL
        SELECT 'Apenas_Graduacao' AS tipo, COUNT(DISTINCT aluno_curso."matricula_aluno") AS total_matriculas
        FROM aluno_curso
        INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
        INNER JOIN curso_counts ON curso_counts."matricula_aluno" = aluno_curso."matricula_aluno"
        WHERE aluno_curso."matricula_aluno" IN (
            SELECT matricula_aluno
            FROM curso_counts
            WHERE total_registros = count_grau_3  -- Todos os registros são de grau 3 (graduação)
            AND count_grau_4 = 0                -- Não há nenhum registro de grau 4 (pós-graduação)
        );

        """

        ret = db.fetch_all(query, id=id)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_vieram_gradu_por_curso(self, id: str, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos que vieram de cada curso da graduação em um determinado curso de pós graduação latu sensu em um determinado curso
        
        Parâmetros:
            id(str): Código do curso.
        """
        query = """

        WITH aluno_cursos AS (
            SELECT ac."matricula_aluno", c."nome" AS nome_curso, c."grau", c."id" AS curso_id,MAX(h."ano_letivo") AS ano_conclusao
            FROM aluno_curso ac
            INNER JOIN cursos c ON c."id" = ac."id_curso"
            LEFT JOIN historico h ON h."matricula_aluno" = ac."matricula_aluno" AND h."cod_aluno_curso" = ac."id"
            GROUP BY ac."matricula_aluno", c."nome", c."grau", c."id"
        ),
        alunos_filtrados AS (
            SELECT "matricula_aluno"
            FROM aluno_cursos
            GROUP BY "matricula_aluno"
            HAVING
                COUNT(CASE WHEN grau = 3 THEN 1 END) = 1 AND  -- Exatamente um curso de graduação
                COUNT(CASE WHEN grau = 4 THEN 1 END) = 1      -- Exatamente um curso de pós-graduação
        )
        SELECT
            ag."nome_curso" AS curso_graduacao,
            COUNT(ag."nome_curso") AS quantidade
        FROM alunos_filtrados af
        LEFT JOIN aluno_cursos ag ON ag."matricula_aluno" = af."matricula_aluno" AND ag."grau" = 3
        LEFT JOIN aluno_cursos ap ON ap."matricula_aluno" = af."matricula_aluno" AND ap."grau" = 4
        WHERE ap."curso_id" = '%(id)s'  -- Filtra pelo ID do curso de pós-graduação
        GROUP BY ag."nome_curso"  -- Agrupa pelo nome do curso de graduação
        ORDER BY quantidade DESC;  -- Ordena pela quantidade em ordem decrescente

        """

        ret = db.fetch_all(query, id=id)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_nao_vieram_gradu_por_curso(self, id: str, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos que não vieram da graduação em um determinado curso de pós graduação latu sensu
        Parâmetros:
            id(str): Código do curso.
        """
        query = """

        WITH curso_counts AS (
            SELECT
                aluno_curso."matricula_aluno",
                COUNT(*) AS total_registros,
                SUM(CASE WHEN cursos."grau" = 3 THEN 1 ELSE 0 END) AS count_grau_3,
                SUM(CASE WHEN cursos."grau" = 4 THEN 1 ELSE 0 END) AS count_grau_4
            FROM aluno_curso
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            GROUP BY aluno_curso."matricula_aluno"
        )
        SELECT
            COUNT(DISTINCT aluno_curso."matricula_aluno") AS total_matriculas
        FROM aluno_curso
        INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
        INNER JOIN curso_counts ON curso_counts."matricula_aluno" = aluno_curso."matricula_aluno"
        WHERE aluno_curso."matricula_aluno" IN (
            SELECT matricula_aluno
            FROM curso_counts
            WHERE total_registros = count_grau_4  -- Deve ter registros apenas com grau 4
            AND count_grau_3 = 0                -- Não deve ter nenhum registro com grau 3
        )
        AND cursos."id" = '%(id)s';
        """

        ret = db.fetch_all(query, id=id)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def temp_med_conclu_por_curso(self, id: str, db: DBConnectorGRAD = None):
        """
        Retorna o tempo medio de conclusao determinado curso de pós graduação latu sensu em meses
        Parâmetros:
            id(str): Código do curso.
        """
        query = """

        WITH subquery AS (
            SELECT DISTINCT
                historico."ano_letivo" AS ANO, 
                historico."semestre" AS SEMESTRE, 
                alunos."matricula" AS MATRI, 
                alunos."anoingresso" AS ANOINGRESSO
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."id" LIKE '%(id)s'
            AND historico."turma" IS NOT NULL
        )
        , quantidade_por_matricula AS (
            SELECT 
                MATRI, 
                ROUND(COUNT(*) * 6.0, 2) AS QUANTIDADE -- multiplicando por 6 para obter em meses
            FROM subquery
            GROUP BY MATRI
        )
        SELECT 
            ROUND(AVG(QUANTIDADE), 2) AS MEDIA_QUANTIDADE_MESES -- Média em meses
        FROM quantidade_por_matricula;
        """

        ret = db.fetch_all(query, id=id)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def forma_ingresso(self, id: str, anoi: int, anof :int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos entrantes por cada modalidade de forma de ingresso.\n

        Parâmetros:\n
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            select fi.descricao, count(al.id_forma_ing) from aluno_curso as al
            inner join forma_ingresso as fi on fi.id = al.id_forma_ing
            where al.id_curso = %(id)s
            and cast(al.ano_admissao as integer) between %(anoi)s and %(anof)s 
            group by fi.id, fi.descricao;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def alunos_necessidade_especial(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a necessidade especial e a quantidade de alunos que a tem, por curso. \n
        
        Parâmetros:\n
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            select foo.necespecial, count(foo.necespecial) from (
                select distinct h.matricula_aluno, al.necespecial from historico as h
                inner join alunos as al on al.matricula = h.matricula_aluno
                inner join disciplinas as d on d.cod_disc = h.cod_disc
                where al.necespecial is not null
                and al.necespecial <> 'NÃO TEM'
                and al.necespecial <> ' NÃO TEM'
                and al.necespecial <> ''
                and d.cod_curso = %(id)s
                and cast(h.ano_letivo as integer) between %(anoi)s and %(anof)s
            ) as foo
            group by foo.necespecial;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def natu_alunos_por_ano(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a naturalidade dos alunos dos cursos e das residências de pós-graduação latu sensu em um determinado periodo
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT municipios."nome" AS NATURALIDADE, historico."ano_letivo" AS ANO,COUNT(DISTINCT alunos."matricula") AS QUANTIDADE_ALUNOS
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN municipios ON municipios."codigo" = alunos."cod_munnasc"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."id" LIKE %(id)s
            AND historico."ano_letivo" between %(anoi)s and %(anof)s
            GROUP BY municipios."nome", cursos."nome", historico."ano_letivo"
            ORDER BY historico."ano_letivo", municipios."nome", cursos."nome";


        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_por_cor_por_ano(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos de cada cor de pele dos cursos e das residências de pós-graduação latu sensu em um determinado periodo 
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT alunos."cor" AS COR, COUNT(DISTINCT alunos."matricula") AS NUMERO_ALUNOS, historico."ano_letivo" AS ANO
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN historico ON historico."matricula_aluno" = alunos."matricula"
            WHERE cursos."id" LIKE %(id)s
            AND historico."ano_letivo" between %(anoi)s and %(anof)s
            AND alunos."cor" IS NOT NULL AND alunos."cor" != 'N' AND alunos."cor" != '0'
            GROUP BY alunos."cor", historico."ano_letivo"
            ORDER BY historico."ano_letivo", alunos."cor";

        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_cursos_ofertados_por_ano(self, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de cursos e residências de pós-graduação latu sensu ofertados em um determinado periodo

        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT historico."ano_letivo" AS ANO, COUNT(DISTINCT cursos."id") AS NUMERO_DE_CURSOS
            FROM cursos
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY historico."ano_letivo"
            ORDER BY historico."ano_letivo";
        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def professores(self, id: str, db: DBConnectorGRAD = None):

        """
        Retorna todos os professores de cursos de pós-graduação latu

        Parâmetros:
            id(str): Código do curso.
        """
        query = """
            select * from professores where cod_prof in (
                select cod_prof from professor_curso where cod_curso = %(id)s
            )
        """
        ret = db.fetch_all(query, id=id)
        return ret

queries_cursos = QueriesCursos()
