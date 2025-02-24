from backend.db.db import DBConnectorGRAD, DBConnectorGRADForm
from backend.core.utils import tratamento_excecao_com_db
import json
from datetime import datetime, date



from backend.core import utils
from typing import List

#db = deps.get_db_grad()

class QueriesFormularioPPGLS():

    @tratamento_excecao_com_db(tipo_banco='grad')
    def inserir_usuarios_formulario(self, db: DBConnectorGRAD = None, **kwargs):
        query = utils.InsertQuery('formulario', **kwargs)
        ret = db.insert(query, **kwargs)
        if ret:
            return True
        return False
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def verifica_pendencia_formulario(self, cpf: str, db: DBConnectorGRAD = None):
        
        ret = db.fetch_one('''select * from formulario where cpf = %(cpf)s''',cpf=cpf)
        if ret:
            return False
        return True



    @tratamento_excecao_com_db(tipo_banco='grad_formularios')   
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
                'especialista': residencia.get('especialista', '')
            }

            try:
                # Inserir residência/especialização
                residencia_query = """
                    INSERT INTO residencia_especializacao_planilha (
                        nome, data_inicio, data_termino, vagas_ofertadas, 
                        vagas_preenchidas, categoria_profissional, centro, r1, r2, r3, especialista
                    )
                    VALUES (
                        %(nome)s, %(data_inicio)s, %(data_termino)s, %(vagas_ofertadas)s, 
                        %(vagas_preenchidas)s, %(categoria_profissional)s, %(centro)s, %(r1)s, %(r2)s, %(r3)s, %(especialista)s
                    )
                """

                db.insert(residencia_query, **residencia_dados)

                # Consultar o último ID inserido
                id_query = "SELECT currval('residencia_especializacao_planilha_id_seq') AS id;"
                result = db.fetch_all(id_query)

                residencia_especializacao_id = result[0]['id'] if result else None

                db.commit()
                print("Dados da residência/especialização que estão sendo inseridos:", residencia_dados)
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

    



    @tratamento_excecao_com_db(tipo_banco='grad_formularios')
    def buscar_formulario_ppgls(self, nome_formulario: str, data_inicio: str, db: DBConnectorGRADForm = None):
        if not nome_formulario or not data_inicio:
            raise ValueError("Os parâmetros 'nome_formulario' e 'data_inicio' são obrigatórios.")

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
            
            -- Dados da tabela residencia_especializacao_planilha
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
            re.especialista,

            -- Dados da tabela professor_carga_horaria
            ph.professor_id,
            ph.vinculo,
            ph.titulacao,
            ph.carga_horaria_jornada_extendida,
            ph.carga_horaria_projeto_extencao,
            ph.carga_horaria_projeto_pesquisa,
            ph.carga_horaria_total,
            ph.ano AS ano_professor,
            ph.semestre AS semestre_professor

            -- Dados da tabela coordenador_carga_horaria
            ch.coordenador_id,
            ch.carga_horaria AS carga_horaria_coordenador,
            ch.ano AS ano_coordenador,
            ch.semestre AS semestre_coordenador
    
            -- Dados dos professores e coordenadores (nomes)
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
                AND resp.data_preenchimento::DATE = %(data_inicio)s;
        """
        
        # Executar a consulta para obter os dados
        resultado = db.fetch_one(query_residencia, nome_formulario=nome_formulario, data_inicio=data_inicio)

        # Se não encontrar o formulário
        if not resultado:
            raise ValueError(f"Formulário não encontrado para o nome '{nome_formulario}' e a data '{data_inicio}'.")
        
        for chave, valor in resultado.items():
            if isinstance(valor, (datetime, date)):
                resultado[chave] = valor.strftime("%Y-%m-%d")

        return resultado


    
    @tratamento_excecao_com_db(tipo_banco='grad_formularios')  
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
