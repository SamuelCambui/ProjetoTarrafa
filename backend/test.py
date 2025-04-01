from db.db import DBConnectorGRAD

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
                EXTRACT(YEAR FROM ac.data_matricula) between 2015 and 2025  -- Ano de matrícula desejado
                AND c.id = 'G605'
                AND c.id_ies = '3727'
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
            pc.ano_matricula, COALESCE(cg.nome_curso_graduacao, 'Não Fizeram Nenhum Curso de Graduação na Unimontes')
        ORDER BY 
            pc.ano_matricula, quantidade_matriculas DESC;
"""

banco = DBConnectorGRAD()

a = banco.fetch_all(query)

print(a)