from backend.db.db import DBConnectorGRAD
from backend.core.utils import tratamento_excecao_com_db

class QueriesCursosLS():
    @tratamento_excecao_com_db(tipo_banco='grad')
    def lista_cursos(self, db: DBConnectorGRAD = None):
        """
        Retorna todos os cursos de pós-graduação latu sensu (Especialização, Residência).
        """
        query= """
            SELECT cursos.id, nome, modalidade, habilita.descricao as habilita 
            FROM cursos
            INNER JOIN habilita ON cursos.cod_habilita = habilita.id
            WHERE cursos.nome LIKE 'PÓS-GRADUAÇÃO LATO SENSU %' 
            OR cursos.nome LIKE 'RES%'
            ORDER BY nome;
        """
        ret = db.fetch_all(query=query)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def retorna_curso(self, id: str, db: DBConnectorGRAD = None):
        """
        Retorna dados de um curso de pós-graduação latu sensu específico.

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
    def quant_alunos_por_semestre(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos por semestre de um curso de pós-graduação latu sensu ao longo do tempo a partir de um ano inicial.

        Parâmetros:
            id(str): Código do curso.
            ano(int): Ano inicial.
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
    def nota_media_por_semestre(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a nota média de um curso de pós-graduação latu sensu em um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            SELECT historico.ano_letivo, historico.semestre, round(AVG(nota), 2) as media FROM historico
            INNER JOIN disciplinas ON disciplinas."cod_disc" = historico."cod_disc"
            INNER JOIN cursos ON cursos."id" = disciplinas."cod_curso"
            WHERE disciplinas.cod_curso = %(id)s AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
            GROUP BY historico.ano_letivo, historico.semestre
            HAVING AVG(nota) IS NOT null
            ORDER BY historico.ano_letivo, historico.semestre
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    @tratamento_excecao_com_db(tipo_banco='grad')
    def percentual_apro_reprov_por_turma(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna o percentual de aluns aprovados e reprovados no semestre dos cursos de pós-graduação latu sensu em um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            WITH alunos_status AS (
                SELECT 
                    historico.ano_letivo, historico.semestre, historico.turma, COUNT(*) AS total_alunos, 
                    COUNT(CASE WHEN nota >= 70 THEN 1 END) AS aprovados, 
                    COUNT(CASE WHEN nota < 70 THEN 1 END) AS reprovados
                FROM historico
                INNER JOIN disciplinas ON disciplinas."cod_disc" = historico."cod_disc"
                INNER JOIN cursos ON cursos."id" = disciplinas."cod_curso"
                WHERE disciplinas.cod_curso = '%(id)s'
                AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                AND historico.nota IS NOT NULL
                GROUP BY historico.ano_letivo, historico.semestre, historico.turma
            )
            SELECT
                ano_letivo, semestre, turma, 
                ROUND((aprovados::decimal / NULLIF(total_alunos, 0)) * 100, 2) AS percentual_aprovados,
                ROUND((reprovados::decimal / NULLIF(total_alunos, 0)) * 100, 2) AS percentual_reprovados
            FROM alunos_status
            ORDER BY 
                ano_letivo, semestre, turma;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_aprov_repro_por_falta_por_turma(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna o percentual de aluns aprovados e reprovados por falta no semestre dos cursos de pós-graduação latu sensu em um determinado período.

        Parâmetros:
            id(str): Código do curso.
            ano(int): Ano inicial.
        """
        query = """
            WITH frequencia AS (
                SELECT 
                    historico.ano_letivo, historico.semestre, historico.turma, COUNT(*) AS total_alunos,
                    COUNT(CASE WHEN historico.percent_freq > 70 THEN 1 END) AS frequencia_maior_70,
                    COUNT(CASE WHEN historico.percent_freq <= 70 THEN 1 END) AS frequencia_menor_igual_70
                FROM historico
                INNER JOIN disciplinas ON disciplinas."cod_disc" = historico."cod_disc"
                INNER JOIN cursos ON cursos."id" = disciplinas."cod_curso"
                WHERE disciplinas.cod_curso = '%(id)s' 
                AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                GROUP BY historico.ano_letivo, historico.semestre, historico.turma
            )
            SELECT
                ano_letivo, semestre, turma,
                frequencia_maior_70 AS qtd_frequencia_maior_70,
                frequencia_menor_igual_70 AS qtd_frequencia_menor_igual_70
            FROM frequencia
            ORDER BY ano_letivo, semestre, turma;

        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def nota_media_por_curso_por_semestre_por_turma(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):

        """
        Retorna a média das notas de das turmas de um semestre por ano de um curso de pós-graduação latu sensu em um determinado período.
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            SELECT historico.ano_letivo, historico.semestre, historico.turma, ROUND(AVG(nota), 2) AS media
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
    def quant_alunos_e_alunas_por_ano(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos homens e mulhes de um curso de pós-graduação latu sensu em um determinado periodo

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            SELECT historico."ano_letivo" AS ANO, alunos."sexo" AS SEXO, COUNT(*) AS QUANTIDADE
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."id" LIKE %(id)s
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY historico."ano_letivo", alunos."sexo"
            ORDER BY historico."ano_letivo";
        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def media_idades_por_ano(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos homens e mulhes de um curso de pós-graduação latu sensu em um determinado periodo

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """
            SELECT historico."ano_letivo" AS ANO, alunos."sexo" AS SEXO, COUNT(*) AS QUANTIDADE
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."id" LIKE %(id)s
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY historico."ano_letivo", alunos."sexo"
            ORDER BY historico."ano_letivo";
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
            WHERE cursos."nome" LIKE %(id)s
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            AND alunos."cor" IS NOT NULL AND alunos."cor" != 'N'
            GROUP BY alunos."cor", historico."ano_letivo"
            ORDER BY historico."ano_letivo", alunos."cor";

        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def nacio_alunos_por_ano(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a nacionalidade dos alunos dos cursos e das residências de pós-graduação latu sensu em um determinado periodo
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT municipios."nome" AS NACIONALIDADE, cursos."nome" AS NOMEESPECIALIZACAO, historico."ano_letivo" AS ANO,COUNT(DISTINCT alunos."matricula") AS QUANTIDADE_ALUNOS
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN municipios ON municipios."codigo" = alunos."cod_munnasc"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."nome" LIKE %(id)s
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY municipios."nome", cursos."nome", historico."ano_letivo"
            ORDER BY historico."ano_letivo", municipios."nome", cursos."nome";


        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def forma_ingresso_por_ano(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a forma de ingresso dos alunos dos cursos e das residências de pós-graduação latu sensu em um determinado periodo 
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT forma_ingresso."descricao" AS FORMADEINGRESSO, historico."ano_letivo" AS ANO,
            COUNT(DISTINCT alunos."matricula") AS NUMERO_ALUNOS
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN forma_ingresso ON forma_ingresso."id" = aluno_curso."id_forma_ing"
            INNER JOIN historico ON historico."matricula_aluno" = alunos."matricula"
            WHERE cursos."nome" LIKE %(id)s
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY forma_ingresso."descricao", historico."ano_letivo"
            ORDER BY historico."ano_letivo", forma_ingresso."descricao";



        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_prof_por_esp_por_ano(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de professores por especialização por ano das residências de pós-graduação latu sensu em um determinado periodo
        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT cursos."nome" AS NOMEESPECIALIZACAO, historico."ano_letivo" AS ANO, COUNT(DISTINCT professores."nome") AS QUANTIDADE_PROFESSORES
            FROM cursos
            INNER JOIN disciplinas ON disciplinas."cod_curso" = cursos."id"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            INNER JOIN professores ON historico."cod_prof" = professores."cod_prof"
            WHERE cursos."nome" LIKE %(id)s
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            GROUP BY cursos."nome", historico."ano_letivo"
            ORDER BY historico."ano_letivo", cursos."nome";



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
    def idades_por_curso(self, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a idades dos alunos de um curso de pós graduação latu seusu
        Parâmetros:
            anoi(int): Ano inicial.
            anof(int): Ano final.
        """
        query = """

            SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, alunos."data_nascimento")) AS IDADE
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."id" LIKE '%(id)s'
            AND historico."ano_letivo" BETWEEN '%(anoi)s' AND '%(anof)s'
            ORDER BY alunos."data_nascimento";

        """

        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_vieram_gradu_por_curso(self, id: str, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos que vieram de cada curso da graduação em um determinado curso de pós graduação latu sensu
        
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
    def quant_alunos_nao_vieram_gradu_por_curso(self, id: str, db: DBConnectorGRAD = None):
        """
        Retorna o tempo medio de conclusao determinado curso de pós graduação latu sensu
        Parâmetros:
            id(str): Código do curso.
        """
        query = """

        WITH subquery AS (
            SELECT DISTINCT
                historico."ano_letivo" AS ANO, historico."semestre" AS SEMESTRE, alunos."matricula" AS MATRI, alunos."anoingresso" AS ANOINGRESSO
            FROM alunos
            INNER JOIN aluno_curso ON alunos."matricula" = aluno_curso."matricula_aluno"
            INNER JOIN cursos ON cursos."id" = aluno_curso."id_curso"
            INNER JOIN disciplinas ON cursos."id" = disciplinas."cod_curso"
            INNER JOIN historico ON historico."cod_disc" = disciplinas."cod_disc"
            WHERE cursos."id" LIKE 'U610'
            AND historico."turma" IS NOT NULL
        )
        , quantidade_por_matricula AS (
            SELECT 
                MATRI, 
                ROUND(COUNT(*) / 2.0, 2) AS QUANTIDADE
            FROM subquery
            GROUP BY MATRI
        )
        SELECT 
            ROUND(AVG(QUANTIDADE), 2) AS MEDIA_QUANTIDADE
        FROM quantidade_por_matricula;
        """

        ret = db.fetch_all(query, id=id)
        return ret
queries_cursos = QueriesCursosLS()
