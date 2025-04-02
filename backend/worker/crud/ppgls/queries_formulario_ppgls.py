from backend.db.db import DBConnectorGRAD, DBConnectorGRADForm
from backend.core.utils import tratamento_excecao_db_grad_form
import json
from datetime import datetime, date



from backend.core import utils
from typing import List

#db = deps.get_db_grad()

class QueriesFormularioPPGLS():

  
    @tratamento_excecao_db_grad_form() 
    def inserir_formulario_ppgls(self, db: DBConnectorGRADForm = None, **kwargs):
        print("Conteúdo de kwargs da query:", kwargs)

        itens = kwargs.get('item', [])
        print("Conteúdo de kwargs na forma de lista:", itens)

        for item in itens:
            # Extraia o campo 'nome' do item
            nome_formulario = item.get('nome')

            # Extraia o campo 'json', que é uma string JSON
            json_str = item.get('json')
            if json_str:
                # Converta a string JSON para um dicionário Python
                json_data = json.loads(json_str)
            else:
                print("Campo 'json' não encontrado ou está vazio.")
                json_data = {}
            

            data_preenchimento = json_data.get('data_preenchimento')

            residencia = json_data.get('residencia_especializacao', {})
            residencia_dados = {
                'nome': str(residencia.get('nome', '')),
                'data_inicio': residencia.get('data_inicio', ''),
                'data_termino': residencia.get('data_termino', ''),
                'vagas_ofertadas': int(residencia.get('vagas_ofertadas', 0)),
                'vagas_preenchidas': int(residencia.get('vagas_preenchidas', 0)),
                'categoria_profissional': str(residencia.get('categoria_profissional', '')),
                'centro': str(residencia.get('centro', '')),
                'r1': residencia.get('r1', ''),
                'r2': residencia.get('r2', ''),
                'r3': residencia.get('r3', ''),
            }

            try:
                # Inserir residência/especialização
                residencia_query = """
                    INSERT INTO residencia_especializacao_planilha (
                        nome, data_inicio, data_termino, vagas_ofertadas, 
                        vagas_preenchidas, categoria_profissional, centro, r1, r2, r3
                    )
                    VALUES (
                        %(nome)s, %(data_inicio)s, %(data_termino)s, %(vagas_ofertadas)s, 
                        %(vagas_preenchidas)s, %(categoria_profissional)s, %(centro)s, %(r1)s, %(r2)s, %(r3)s
                    )
                """

                db.insert(residencia_query, **residencia_dados)

                # Consultar o último ID inserido
                id_query = "SELECT currval('residencia_especializacao_planilha_id_seq') AS id;"
                result = db.fetch_all(id_query)

                residencia_especializacao_id = result[0]['id'] if result else None

                db.commit()
                # print("Dados da residência/especialização que estão sendo inseridos:", residencia_dados)
            except Exception as e:
                print(f"Erro ao inserir residência/especialização: {e}")
                db.rollback()

            coordenador = json_data.get('coordenador', {})
            coordenador_dados = {
                'id': str(coordenador.get('id')),
                'nome': str(coordenador.get('nome'))
            }

            coordenador_query = """
                INSERT INTO coordenador_planilha (id, nome)
                VALUES (%(id)s, %(nome)s)
                ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome
            """
            db.insert(coordenador_query, **coordenador_dados)

            coordenador_carga_horaria_dados = {
                'coordenador_id': coordenador['id'],
                'carga_horaria': int(coordenador.get('carga_horaria')),
                'ano': int(coordenador.get('ano')),
                'semestre': int(coordenador.get('semestre')),
                'nome_formulario': item.get('nome'),
                'data_preenchimento': json_data.get('data_preenchimento')
            }

            coordenador_query = """
                INSERT INTO coordenador_carga_horaria (
                    coordenador_id, carga_horaria, ano, semestre, nome_formulario, data_preenchimento 
                )VALUES(
                    %(coordenador_id)s, %(carga_horaria)s, %(ano)s, %(semestre)s, %(nome_formulario)s, %(data_preenchimento)s
                )
            """

            try:
                db.insert(coordenador_query, **coordenador_carga_horaria_dados)
                id_query = "SELECT currval('coordenador_carga_horaria_id_seq') AS id;"
                result = db.fetch_all(id_query)
                coordenador_carga_horaria_id = result[0]['id'] if result else None

                db.commit()
            except Exception as e:
                print(f"Erro ao inserir coordenador carga horária: {e}")

            professores = json_data.get('professores', [])
            for professor in professores:
                professor_dados = {
                    'id': professor.get('id'),
                    'nome': professor.get('nome')      
                }

                professor_query = """
                INSERT INTO professor_planilha (id, nome)
                VALUES (%(id)s, %(nome)s)
                ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome
                """

                db.insert(professor_query, **professor_dados)

                professor_carga_dados = {
                    'professor_id': professor.get('id'),
                    'vinculo': professor.get('vinculo'),
                    'titulacao' : professor.get('titulacao'),
                    'carga_horaria_jornada_extendida': int(professor.get('carga_horaria_jornada_extendida')),
                    'carga_horaria_projeto_extencao': int(professor.get('carga_horaria_projeto_extencao')),
                    'carga_horaria_projeto_pesquisa': int(professor.get('carga_horaria_projeto_pesquisa')),
                    'carga_horaria_total': int(professor.get('carga_horaria_total')),
                    'ano': int(professor.get('ano')),
                    'semestre': int(professor.get('semestre')),
                    'nome_formulario': item.get('nome'),
                    'data_preenchimento': json_data.get('data_preenchimento')
                }

                professor_query = """
                    INSERT INTO professor_carga_horaria(
                        professor_id, vinculo, titulacao, carga_horaria_jornada_extendida, carga_horaria_projeto_extencao, 
                        carga_horaria_projeto_pesquisa, carga_horaria_total, ano, semestre, nome_formulario, data_preenchimento
                    )
                    VALUES(
                        %(professor_id)s, %(vinculo)s, %(titulacao)s, %(carga_horaria_jornada_extendida)s, 
                        %(carga_horaria_projeto_extencao)s, %(carga_horaria_projeto_pesquisa)s, %(carga_horaria_total)s,
                        %(ano)s, %(semestre)s, %(nome_formulario)s, %(data_preenchimento)s
                    )
                """

                db.insert(professor_query, **professor_carga_dados)
                id_query = "SELECT currval('professor_carga_horaria_id_seq') AS id;"
                result = db.fetch_all(id_query)
                professor_carga_horaria_id = result[0]['id'] if result else None
                db.commit()


                # Inserir relação entre residência/especialização, professor e coordenador
                relacao_query = """
                    INSERT INTO residencia_especializacao_professor_planilha  (
                        nome_formulario, data_preenchimento, residencia_especializacao_id, professor_carga_horaria_id, coordenador_carga_horaria_id   
                    )
                    VALUES(
                        %(nome_formulario)s, %(data_preenchimento)s, %(residencia_especializacao_id)s, %(professor_carga_horaria_id)s,  %(coordenador_carga_horaria_id)s
                    )
                """
                relacao_dados = {
                    'nome_formulario': nome_formulario,
                    'data_preenchimento': data_preenchimento,
                    'residencia_especializacao_id': residencia_especializacao_id,
                    'professor_carga_horaria_id': professor_carga_horaria_id,
                    'coordenador_carga_horaria_id':coordenador_carga_horaria_id
                }

                db.insert(relacao_query, **relacao_dados)
                db.commit()

        return True

    



    @tratamento_excecao_db_grad_form()
    def buscar_formulario_ppgls(self, nome_formulario: str, data_preenchimento: str, db: DBConnectorGRADForm = None):
        if not nome_formulario or not data_preenchimento:
            raise ValueError("Os parâmetros 'nome_formulario' e 'data_preenchimento' são obrigatórios.")

        # Buscar todos os dados relacionados ao formulário, conforme a consulta SQL
        query_residencia = """
        SELECT 
            resp.id AS formulario_id,
            resp.nome_formulario,
            resp.data_preenchimento,
            resp.residencia_especializacao_id,
            resp.professor_carga_horaria_id,
            resp.coordenador_carga_horaria_id,
            resp.unique_identifier,
            re.nome AS nome_residencia,
            re.data_inicio,
            re.data_termino,
            re.vagas_ofertadas,
            re.vagas_preenchidas,
            re.categoria_profissional,
            re.centro,
            re.r1,
            re.r2,
            re.r3,
            ph.professor_id,
            ph.vinculo,
            ph.titulacao,
            ph.carga_horaria_jornada_extendida,
            ph.carga_horaria_projeto_extencao,
            ph.carga_horaria_projeto_pesquisa,
            ph.carga_horaria_total,
            ph.ano AS ano_professor,
            ph.semestre AS semestre_professor,
            ch.coordenador_id,
            ch.carga_horaria AS carga_horaria_coordenador,
            ch.ano AS ano_coordenador,
            ch.semestre AS semestre_coordenador,
            p.nome AS nome_professor,
            c.nome AS nome_coordenador
        FROM 
            residencia_especializacao_professor_planilha resp
        JOIN 
            residencia_especializacao_planilha re ON re.id = resp.residencia_especializacao_id
        JOIN 
            professor_carga_horaria ph ON ph.id = resp.professor_carga_horaria_id
        JOIN 
            coordenador_carga_horaria ch ON ch.id = resp.coordenador_carga_horaria_id
        JOIN 
            professor_planilha p ON p.id = ph.professor_id
        JOIN 
            coordenador_planilha c ON c.id = ch.coordenador_id
        WHERE 
            resp.nome_formulario = %(nome_formulario)s
            AND resp.data_preenchimento = %(data_preenchimento)s;
        """
        
        # Executar a consulta para obter os dados
        resultados = db.fetch_all(query_residencia, nome_formulario=nome_formulario, data_preenchimento=data_preenchimento)

        # Se não encontrar o formulário
        if not resultados:
            raise ValueError(f"Formulário não encontrado para o nome '{nome_formulario}' e a data '{data_preenchimento}'.")

        # Pegamos os dados gerais do formulário apenas da primeira linha
        primeira_linha = resultados[0]

        # Dicionário para armazenar os professores sem duplicação
        professores_dict = {}

        for row in resultados:
            professor = {
                "professor_id": row[17],  # professor_id
                "nome_professor": row[30],  # nome_professor
                "vinculo": row[18],  # vinculo
                "titulacao": row[19],  # titulacao
                "carga_horaria_jornada_extendida": row[20],  # carga_horaria_jornada_extendida
                "carga_horaria_projeto_extencao": row[21],  # carga_horaria_projeto_extencao
                "carga_horaria_projeto_pesquisa": row[22],  # carga_horaria_projeto_pesquisa
                "carga_horaria_total": row[23],  # carga_horaria_total
                "ano_professor": row[24],  # ano_professor
                "semestre_professor": row[25]  # semestre_professor
            }

            # Verifica se o professor já foi adicionado para evitar duplicação
            if professor["professor_id"] not in professores_dict:
                professores_dict[professor["professor_id"]] = professor

        # Criando o coordenador a partir da primeira linha (não duplicar)
        coordenador = {
            "coordenador_id": primeira_linha[26],  # coordenador_id
            "nome_coordenador": primeira_linha[31],  # nome_coordenador
            "carga_horaria_coordenador": primeira_linha[27],  # carga_horaria_coordenador
            "ano_coordenador": primeira_linha[28],  # ano_coordenador
            "semestre_coordenador": primeira_linha[29]  # semestre_coordenador
        }

        # Montando o formulário com os dados recuperados
        formulario = {
            "nome_formulario": primeira_linha[1],  # nome_formulario
            "data_preenchimento": primeira_linha[2].strftime("%Y-%m-%d") if isinstance(primeira_linha[2], (datetime, date)) else primeira_linha[2],
            "nome_residencia": primeira_linha[7],  # nome_residencia
            "data_inicio": primeira_linha[8].strftime("%Y-%m-%d") if isinstance(primeira_linha[8], (datetime, date)) else primeira_linha[8],
            "data_termino": primeira_linha[9].strftime("%Y-%m-%d") if isinstance(primeira_linha[9], (datetime, date)) else primeira_linha[9],
            "vagas_ofertadas": primeira_linha[10],  # vagas_ofertadas
            "vagas_preenchidas": primeira_linha[11],  # vagas_preenchidas
            "categoria_profissional": primeira_linha[12],  # categoria_profissional
            "centro": primeira_linha[13],  # centro
            "r1": primeira_linha[14],  # r1
            "r2": primeira_linha[15],  # r2
            "r3": primeira_linha[16],  # r3
            "professores": list(professores_dict.values()),  # lista de professores sem duplicação
            "coordenador": coordenador  # coordenador único
        }

        # Retorna o objeto formulado em formato JSON para compatibilidade com a mensagem `FormularioPPGLSJson`
        return formulario


    @tratamento_excecao_db_grad_form()
    def listar_formularios_ppgls(self, db: DBConnectorGRADForm = None):
        # Buscar todos os dados dos formulários
        query_residencia = """
            SELECT DISTINCT 
                residencia_especializacao_professor_planilha.nome_formulario AS nome,
                residencia_especializacao_professor_planilha.data_preenchimento AS data_preenchimento
            FROM residencia_especializacao_professor_planilha;
        """
        
        # Executar a consulta para obter os dados
        resultados = db.fetch_all(query_residencia)  # Alterado para `fetch_all()` para pegar todos os registros

        # Se não encontrar formulários, retorna uma lista vazia
        if not resultados:
            return []

        # Estrutura os dados retornados como uma lista de dicionários
        formatted_resultados = []
        
        for row in resultados:
            resultado = {
                "nome": row[0], 
                "data_preenchimento": row[1]
            }

            # Formatar a data
            for chave, valor in resultado.items():
                if isinstance(valor, (datetime, date)):
                    resultado[chave] = valor.strftime("%Y-%m-%d %H:%M:%S")  # Formatação da data

            # Adicionar ao resultado formatado
            formatted_resultados.append(resultado)

        return formatted_resultados




    
    @tratamento_excecao_db_grad_form()
    def excluir_formulario_ppgls(self, nome_formulario: str, data_inicio: str, db: DBConnectorGRADForm = None):
        print(f"Excluindo formulário com nome: {nome_formulario} e data_inicio: {data_inicio}")

        try:
            # Excluir a relação entre residência/especialização, professor e coordenador
            relacao_query = """
                DELETE FROM residencia_especializacao_professor_planilha
                WHERE nome_formulario = %(nome_formulario)s
                AND data_preenchimento::DATE = %(data_inicio)s;
            """
            db.delete(relacao_query, nome_formulario=nome_formulario, data_inicio=data_inicio)

            # Excluir carga horária dos professores
            professor_carga_query = """
                DELETE FROM professor_carga_horaria
                WHERE nome_formulario = %(nome_formulario)s
                AND data_preenchimento::DATE = %(data_inicio)s;
            """
            db.delete(professor_carga_query, nome_formulario=nome_formulario, data_inicio=data_inicio)

            # Excluir carga horária do coordenador
            coordenador_carga_query = """
                DELETE FROM coordenador_carga_horaria
                WHERE nome_formulario = %(nome_formulario)s
                AND data_preenchimento::DATE = %(data_inicio)s;
            """
            db.delete(coordenador_carga_query, nome_formulario=nome_formulario, data_inicio=data_inicio)

            # Excluir professor (considerando que a exclusão pode ocorrer apenas se não houver dependência)
            professor_query = """
                DELETE FROM professor_planilha
                WHERE id IN (
                    SELECT professor_id FROM professor_carga_horaria
                    WHERE nome_formulario = %(nome_formulario)s
                    AND data_preenchimento::DATE = %(data_inicio)s
                );
            """
            db.delete(professor_query, nome_formulario=nome_formulario, data_inicio=data_inicio)

            # Excluir coordenador
            coordenador_query = """
                DELETE FROM coordenador_planilha
                WHERE id IN (
                    SELECT coordenador_id FROM coordenador_carga_horaria
                    WHERE nome_formulario = %(nome_formulario)s
                    AND data_preenchimento::DATE = %(data_inicio)s
                );
            """
            db.delete(coordenador_query, nome_formulario=nome_formulario, data_inicio=data_inicio)

            # Excluir residência/especialização
            residencia_query = """
                DELETE FROM residencia_especializacao_planilha
                WHERE nome = %(nome_formulario)s
                AND data_inicio = %(data_inicio)s;
            """
            db.delete(residencia_query, nome_formulario=nome_formulario, data_inicio=data_inicio)

            db.commit()
            print(f"Formulário com nome {nome_formulario} e data_inicio {data_inicio} excluído com sucesso.")
        except Exception as e:
            print(f"Erro ao excluir o formulário: {e}")
            db.rollback()

        return True
    
  
queries_formulario_ppgls = QueriesFormularioPPGLS()
