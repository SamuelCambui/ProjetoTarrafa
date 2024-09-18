from backend.db.db import DBConnectorGRAD
from backend.core.utils import tratamento_excecao_com_db

class QueriesDisciplinas():
    # TODO
    # PROVA FINALL
    @tratamento_excecao_com_db(tipo_banco='grad')
    def retorna_disciplina(self, id: int, db: DBConnectorGRAD = None):
        """
        Retorna uma disciplina em específico.

        Parâmetros:
            id(int): Código da disciplina. 
        """
        query = "SELECT * FROM disciplinas WHERE cod_disc = %(id)s"
        ret = db.fetch_one(query, id=id)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def retorna_disciplinas(self, id: str, db: DBConnectorGRAD = None):
        """
        Retorna todas as disciplinas de um curso.

        Parâmetros:
            id(str): Código do curso. 
        """
        query = "SELECT * FROM disciplinas WHERE cod_curso = %(id)s"
        ret = db.fetch_all(query, id=id)
        return ret
    

    @tratamento_excecao_com_db(tipo_banco='grad')
    def quant_alunos_por_semestre(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a quantidade de alunos por semestre de um curso de pós-graduação latu sensu ao longo do tempo a partir de um ano inicial.

        Parâmetros:
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano final.

        """
        query = """
            SELECT foo.ano_letivo, foo.semestre, COUNT(foo.ano_letivo) AS quantidade FROM ( 
                SELECT historico.ano_letivo, historico.semestre FROM historico 
                INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc	
                WHERE disciplinas.cod_disc= %(id)s AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                GROUP BY matricula_aluno, historico.ano_letivo, historico.semestre
                ORDER BY historico.ano_letivo, historico.semestre
            ) AS foo
            GROUP BY foo.ano_letivo, foo.semestre
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
   
    
    @tratamento_excecao_com_db(tipo_banco='grad')    
    def reprovacoes_por_falta_por_semestre_curso(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna reprovações das disciplinas de um curso por falta por semestre de um determinado período.

        Parâmetros:
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
        """
        query = """
            SELECT COUNT(disciplinas.disciplina) as alunos_reprovados, ano_letivo,
            historico.semestre FROM historico
            INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc
            INNER JOIN cursos ON cursos.id = disciplinas.cod_curso
            WHERE percent_freq < 70.0
            AND disciplinas.cod_disc = %(id)s
            AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s 
            GROUP BY disciplinas.cod_disc, ano_letivo, disciplinas.disciplina, cursos.nome, historico.semestre
            ORDER BY ano_letivo, semestre, disciplinas.disciplina;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    

    @tratamento_excecao_com_db(tipo_banco='grad')    
    def aprovacoes_por_falta_por_semestre_curso(self, id: str, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna aprovações das disciplinas de um curso por falta por semestre de um determinado período.

        Parâmetros:
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
        """
        query = """
            SELECT COUNT(disciplinas.disciplina) as Alunos_Aprovados, ano_letivo,
            historico.semestre FROM historico
            INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc
            INNER JOIN cursos ON cursos.id = disciplinas.cod_curso
            WHERE percent_freq >= 70.0
            AND disciplinas.cod_disc = %(id)s
            AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s 
            GROUP BY disciplinas.cod_disc, ano_letivo, disciplinas.disciplina, cursos.nome, historico.semestre
            ORDER BY ano_letivo, semestre, disciplinas.disciplina;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def reprovacoes_por_semestre(self, id: int, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna reprovações de uma disciplina por semestre de um determinado período.

        Parâmetros:
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
        """
        query = """
            SELECT COUNT(disciplinas.disciplina) as Alunos_Reprovados, ano_letivo,
            historico.semestre FROM historico
            INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc
            INNER JOIN cursos ON cursos.id = disciplinas.cod_curso
            WHERE nota < 70.0
            AND disciplinas.cod_disc = %(id)s
            AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
            GROUP BY disciplinas.cod_disc, ano_letivo, disciplinas.disciplina, cursos.nome, historico.semestre
            ORDER BY ano_letivo, semestre, disciplinas.disciplina;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')    
    def aprovacoes_por_semestre(self, id: int, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna aprovações de uma disciplina por semestre de um determinado período.

        Parâmetros:
            id(int): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
        """
        query = """
            SELECT COUNT(disciplinas.disciplina) as Alunos_Aprovados, ano_letivo,
            historico.semestre FROM historico
            INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc
            INNER JOIN cursos ON cursos.id = disciplinas.cod_curso
            WHERE nota >= 70.0
            AND disciplinas.cod_disc = %(id)s
            AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
            GROUP BY disciplinas.cod_disc, ano_letivo, disciplinas.disciplina, cursos.nome, historico.semestre
            ORDER BY ano_letivo, semestre, disciplinas.disciplina;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def nota_media_por_semestre(self, id: int, anoi: int, anof: int, db: DBConnectorGRAD = None):
        """
        Retorna a média de notas de uma disciplina por semestre de um determinado período.
        
        Parâmetros:\n
            id(str): Código da disciplina.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
        """
        query = """
            SELECT historico.ano_letivo, historico.semestre, round(AVG(nota), 2) as media FROM historico
            INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc
            WHERE disciplinas.cod_disc = %(id)s AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
            GROUP BY historico.ano_letivo, historico.semestre
            HAVING AVG(nota) IS NOT null
            ORDER BY historico.ano_letivo, historico.semestre;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof)
        return ret
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def reprovacoes_por_serie(self, id: str, anoi: int, anof: int, serie: int, db: DBConnectorGRAD = None):
        """
        Retorna a média de todas as disciplinas de uma serie em determinado período.\n
        Ex: Retorna a média de reprovações de todas as disciplinas do 1º período do curso entre 2022 e 2024.\n
        Parâmetros:\n
            id(str): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
            serie(int): Série desejada.
        """
        query = """
            SELECT foo.cod_disc, foo.disciplina, ROUND(AVG(foo.alunos_reprovados), 2) FROM
                (
                    SELECT disciplinas.cod_disc, disciplinas.disciplina, historico.semestre, historico.ano_letivo, COUNT(disciplinas.disciplina) AS Alunos_Reprovados
                    FROM historico
                    INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc
                    WHERE nota < 70.0
                    AND disciplinas.cod_disc in (
                        SELECT distinct d.cod_disc FROM historico AS h
                        INNER JOIN disciplinas AS d ON d.cod_disc = h.cod_disc
                        WHERE d.cod_curso = %(id)s
                        AND h.serie = %(serie)s
                        AND d.cod_disc IN (
                            SELECT DISTINCT historico.cod_disc FROM historico
                            WHERE CAST(ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                        )
                    )
                    AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                    GROUP BY disciplinas.cod_disc, disciplinas.disciplina, historico.semestre, historico.ano_letivo
                    ORDER BY disciplinas.disciplina
                ) as foo
            GROUP BY foo.cod_disc, foo.disciplina;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof, serie=serie)
        return ret

    @tratamento_excecao_com_db(tipo_banco='grad')
    def media_disciplinas_por_serie(self, id: str, anoi: int, anof: int, serie:int, db: DBConnectorGRAD = None):
        """
        Retorna a média de todas as disciplinas de uma serie.\n
        Ex: Retorna a média de todas as disciplinas do 1º período do curso.\n
        Parâmetros:\n
            id(int): Código do curso.
            anoi(int): Ano inicial.
            anof(int): Ano Final.
            serie(int): Série desejada.
        """
        query = """
            SELECT disciplinas.cod_disc, disciplinas.disciplina, round(AVG(nota), 2) AS media FROM historico
            INNER JOIN disciplinas ON disciplinas.cod_disc = historico.cod_disc
            WHERE disciplinas.cod_disc IN (
                SELECT distinct d.cod_disc FROM historico AS h
                INNER JOIN disciplinas AS d ON d.cod_disc = h.cod_disc
                WHERE d.cod_curso = %(id)s 
                AND h.serie = %(serie)s 
                AND d.cod_disc IN (
                    SELECT DISTINCT historico.cod_disc FROM historico
                    WHERE CAST(ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
                )
            )
            AND CAST(historico.ano_letivo AS integer) BETWEEN %(anoi)s AND %(anof)s
            GROUP BY disciplinas.cod_disc, disciplinas.disciplina
            HAVING AVG(nota) IS NOT null;
        """
        ret = db.fetch_all(query, id=id, anoi=anoi, anof=anof, serie=serie)
        return ret

queries_disciplinas = QueriesDisciplinas()
