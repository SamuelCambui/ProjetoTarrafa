from backend.db.db import DBConnectorGRAD, DBConnectorGRADForm
from backend.core.utils import tratamento_excecao_db_grad, tratamento_excecao_db_grad_form
import json
from backend.core import utils

#db = deps.get_db_grad()

class QueriesPPGLS():

    @tratamento_excecao_db_grad()
    def inserir_usuarios_formulario(self, db: DBConnectorGRAD = None, **kwargs):
        query = utils.InsertQuery('formulario', **kwargs)
        ret = db.insert(query, **kwargs)
        if ret:
            return True
        return False
    
    @tratamento_excecao_db_grad()
    def verifica_pendencia_formulario(self, cpf: str, db: DBConnectorGRAD = None):
        
        ret = db.fetch_one('''select * from formulario where cpf = %(cpf)s''',cpf=cpf)
        if ret:
            return False
        return True

    @tratamento_excecao_db_grad_form()
    def busca_professor_coordenador_ppgls(self, masp: int, tipo: int, db: DBConnectorGRADForm = None):
        """
        Retorna os dados de um professor específico

        Parâmetros:
            masp(int): Código MASP do professor.
            tipo(int): 1 = professor, 2 = coordenador.
        """
        try:
            if tipo == 1:
                # Log antes de executar a consulta SQL para coordenador
                print(f"Executando consulta para coordenador com masp={masp}")
                query = """
                select * from professor_planilha where id = %(masp)s
                """
                ret = db.fetch_one(query, masp=masp)
                # Log do resultado da consulta
                print(f"Resultado da consulta coordenador: {ret}")
                return ret
            
            if tipo == 2:
                # Log antes de executar a consulta SQL para professor
                print(f"Executando consulta para professor com masp={masp}")
                query = """
                select * from coordenador_planilha where id = %(masp)s
                """
                ret = db.fetch_one(query, masp=masp)
                # Log do resultado da consulta
                print(f"Resultado da consulta professor: {ret}")
                return ret
    
        except Exception as e:
            # Log de exceção em caso de erro no banco de dados
            print(f"Erro ao executar busca_professor_coordenador_ppgls: {e}")
            raise

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

            query_verificar = """
            SELECT 1 FROM residencia_especializacao_professor_planilha 
            WHERE nome_formulario = %(nome_formulario)s 
            AND data_preenchimento = %(data_preenchimento)s
            """
            existe = db.fetch_one(query_verificar, nome_formulario=nome_formulario, data_preenchimento=data_preenchimento)
            
            if existe:
                raise ValueError("Formulário já existe para este nome e data de preenchimento.")
            else:
                residencia = json_data.get('residencia_especializacao', {})
                residencia_id = residencia.get('id', 0)
                # Criar o dicionário com os dados extraídos
                residencia_dados = {
                    'id': int(residencia.get('id', 0)),
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
                    # Criar a query de inserção
                    residencia_query = """
                        INSERT INTO residencia_especializacao_planilha (
                            id, nome, data_inicio, data_termino, vagas_ofertadas, 
                            vagas_preenchidas, categoria_profissional, centro, r1, r2, r3, especialista
                        )
                        VALUES (
                            %(id)s, %(nome)s, %(data_inicio)s, %(data_termino)s, %(vagas_ofertadas)s, 
                            %(vagas_preenchidas)s, %(categoria_profissional)s, %(centro)s, %(r1)s, %(r2)s, %(r3)s, %(especialista)s
                        )
                    """
                    try:
                        # Executar a inserção
                        db.insert(residencia_query, **residencia_dados)
                        # Confirmar a transação
                        db.commit()
                        print("Dados da residência/especialização que estão sendo inseridos:", residencia_dados)
                    except Exception as e:
                        print(f"Erro ao inserir residência/especialização: {e}")



                except Exception as e:
                    # Captura e tratamento de erro
                    print(f"Erro ao inserir residência/especialização: {e}")
                    # Reverter as mudanças em caso de erro
                    db.rollback()


                coordenador = json_data.get('coordenador', {})
                coordenador_masp = int(coordenador.get('coordenador_masp'))
                coordenador_nome = coordenador.get('coordenador_nome')
                coordenador_carga_horaria = int(coordenador.get('carga_horaria'))

                # Query para verificar se o coordenador já existe
                verificar_query = """
                    SELECT id FROM coordenador_planilha WHERE id =  %(coordenador_masp)s
                """

                existe = db.fetch_one(verificar_query, coordenador_masp=coordenador_masp)
                
                
                coordenador_dados = {
                    'id': int(coordenador.get('coordenador_masp')),
                    'nome': coordenador_nome,
                    'carga_horaria': coordenador_carga_horaria
                }

                if existe:
                    # Se o coordenador já existe, faça um UPDATE
                    coordenador_query = """
                        UPDATE coordenador_planilha
                        SET nome = %(nome)s, carga_horaria = %(carga_horaria)s
                        WHERE id = %(id)s
                    """
                    db.update(coordenador_query, **coordenador_dados)
                    db.commit()
                else:
                    coordenador_query = """
                        INSERT INTO coordenador_planilha (
                            id, nome, carga_horaria
                        )VALUES(
                            %(id)s, %(nome)s, %(carga_horaria)s
                        )
                    """
                    db.insert(coordenador_query, **coordenador_dados)
                    db.commit()


                professores = json_data.get('professores', [])
                for professor in professores:
                    professor_masp = professor.get('id')
                    professor_nome = professor.get('nome')
                    professor_vinculo = professor.get('vinculo')
                    professor_titulacao = professor.get('titulacao')
                    professor_carga_horaria_jornada_extendida = int(professor.get('carga_horaria_jornada_extendida'))
                    professor_carga_horaria_projeto_extencao = int(professor.get('carga_horaria_projeto_extencao'))
                    professor_carga_horaria_projeto_pesquisa = int(professor.get('carga_horaria_projeto_pesquisa'))
                    professor_carga_horaria_total = int(professor.get('carga_horaria_total'))


                    # Query para verificar se o professor já existe
                    verificar_professor_query = f"""
                        SELECT id FROM professor_planilha WHERE id = '{professor_masp}'
                    """
                    resultado_professor = db.fetch_one(verificar_professor_query)
                    db.commit()

                    professor_dados = {
                        'id': professor_masp,
                        'nome': professor_nome,
                        'vinculo': professor_vinculo,
                        'titulacao': professor_titulacao,
                        'carga_horaria_jornada_extendida': professor_carga_horaria_jornada_extendida,
                        'carga_horaria_projeto_extencao': professor_carga_horaria_projeto_extencao,
                        'carga_horaria_projeto_pesquisa': professor_carga_horaria_projeto_pesquisa,
                        'carga_horaria_total': professor_carga_horaria_total
                    }

                    if resultado_professor:
                        # Se o professor já existe, fazer update
                        professor_query = """
                            UPDATE professor_planilha
                            SET nome = %(nome)s,
                                vinculo = %(vinculo)s,
                                titulacao = %(titulacao)s,
                                carga_horaria_jornada_extendida = %(carga_horaria_jornada_extendida)s,
                                carga_horaria_projeto_extencao = %(carga_horaria_projeto_extencao)s,
                                carga_horaria_projeto_pesquisa = %(carga_horaria_projeto_pesquisa)s,
                                carga_horaria_total = %(carga_horaria_total)s
                            WHERE id = %(id)s
                        """
                        db.update(professor_query, **professor_dados)
                    else:
                        professor_query = """
                            INSERT INTO professor_planilha(
                                id, nome, vinculo, titulacao, carga_horaria_jornada_extendida, carga_horaria_projeto_extencao, 
                                carga_horaria_projeto_pesquisa, carga_horaria_total 
                            )
                            VALUES(
                                %(id)s, %(nome)s, %(vinculo)s, %(titulacao)s, %(carga_horaria_jornada_extendida)s, 
                                %(carga_horaria_projeto_extencao)s, %(carga_horaria_projeto_pesquisa)s, %(carga_horaria_total)s
                            )
                        """
                        db.insert(professor_query, **professor_dados)
                        db.commit()

                    # Inserir relação entre residência/especialização, professor e coordenador
                    relacao_query = """
                        INSERT INTO residencia_especializacao_professor_planilha(
                            nome_formulario, data_preenchimento, residencia_especializacao_id, professor_id, coordenador_id  
                        )
                        VALUES(
                            %(nome_formulario)s, %(data_preenchimento)s, %(residencia_id)s, %(professor_id)s, %(coordenador_masp)s
                        )
                    """
                    relacao_dados = {
                        'nome_formulario': nome_formulario,
                        'data_preenchimento': data_preenchimento,
                        'residencia_id': residencia_id,
                        'professor_id': professor_masp,
                        'coordenador_masp': coordenador_masp
                    }
                    db.insert(relacao_query, **relacao_dados)
                    db.commit()
        
            return True
    

    
    @tratamento_excecao_db_grad_form()
    def alterar_formulario_ppgls(self, db: DBConnectorGRADForm = None, **kwargs):
       
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

            # Extraia os campos desejados do dicionário json_data
            data_inicio = json_data.get('data_inicio')
            data_preenchimento = json_data.get('data_preenchimento')

            # Verificar se o formulário existe
            query_verificar = """
            SELECT 1 FROM residencia_especializacao_professor_planilha 
            WHERE nome_formulario = %(nome_formulario)s 
            AND data_preenchimento = %(data_preenchimento)s
            """
            existe = db.fetch_one(query_verificar, nome_formulario=nome_formulario, data_preenchimento=data_preenchimento)

            if not existe:
                raise ValueError("Formulário não encontrado para este nome e data de início.")
            
        
            residencia = json_data.get('residencia_especializacao', {})
            residencia_dados = {
                    'id': int(residencia.get('id', 0)),
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
                # Criar a query de atualização
                residencia_query = """
                    UPDATE residencia_especializacao_planilha 
                    SET nome = %(nome)s, data_inicio = %(data_inicio)s, data_termino = %(data_termino)s,
                        vagas_ofertadas = %(vagas_ofertadas)s, vagas_preenchidas = %(vagas_preenchidas)s,
                        categoria_profissional = %(categoria_profissional)s, centro = %(centro)s, r1 = %(r1)s, r2 = %(r2)s, r3 = %(r3)s, especialista = %(especialista)s
                    WHERE id = %(id)s
                """
                # Executar a atualização
                db.update(residencia_query, **residencia_dados)
                db.commit()

            except Exception as e:
                print(f"Erro ao atualizar residência/especialização: {e}")
                db.rollback()

            # Atualizar Coordenador
            coordenador = json_data.get('coordenador', {})
            coordenador_dados = {
                'id': int(coordenador.get('coordenador_masp')),
                'nome': coordenador.get('coordenador_nome'),
                'carga_horaria': int(coordenador.get('carga_horaria'))
            }

            try:
                # Atualizar os dados do coordenador
                coordenador_query = """
                    UPDATE coordenador_planilha
                    SET nome = %(nome)s, carga_horaria = %(carga_horaria)s
                    WHERE id = %(id)s
                """
                db.update(coordenador_query, **coordenador_dados)
                db.commit()

            except Exception as e:
                print(f"Erro ao atualizar coordenador: {e}")
                db.rollback()

            # Atualizar Professores
            professores = json_data.get('professores', [])
            for professor in professores:
                professor_dados = {
                    'id': professor.get('id'),
                    'nome': professor.get('nome'),
                    'vinculo': professor.get('vinculo'),
                    'titulacao': professor.get('titulacao'),
                    'carga_horaria_jornada_extendida': int(professor.get('carga_horaria_jornada_extendida')),
                    'carga_horaria_projeto_extencao': int(professor.get('carga_horaria_projeto_extencao')),
                    'carga_horaria_projeto_pesquisa': int(professor.get('carga_horaria_projeto_pesquisa')),
                    'carga_horaria_total': int(professor.get('carga_horaria_total'))
                }

                try:
                    # Atualizar professor
                    professor_query = """
                        UPDATE professor_planilha
                        SET nome = %(nome)s, vinculo = %(vinculo)s, titulacao = %(titulacao)s,
                            carga_horaria_jornada_extendida = %(carga_horaria_jornada_extendida)s,
                            carga_horaria_projeto_extencao = %(carga_horaria_projeto_extencao)s,
                            carga_horaria_projeto_pesquisa = %(carga_horaria_projeto_pesquisa)s,
                            carga_horaria_total = %(carga_horaria_total)s
                        WHERE id = %(id)s
                    """
                    db.update(professor_query, **professor_dados)
                    db.commit()

                except Exception as e:
                    print(f"Erro ao atualizar professor: {e}")
                    db.rollback()

                # Atualizar relação entre residência/especialização, professor e coordenador
                try:
                    relacao_query = """
                        UPDATE residencia_especializacao_professor_planilha
                        SET nome_formulario = %(nome_formulario)s, data_preenchimento = %(data_preenchimento)s,
                            professor_id = %(professor_id)s, coordenador_id = %(coordenador_masp)s
                        WHERE residencia_especializacao_id = %(residencia_id)s
                        AND professor_id = %(professor_id)s
                    """
                    relacao_dados = {
                        'nome_formulario': nome_formulario,
                        'data_preenchimento': data_preenchimento,
                        'residencia_id': int(residencia.get('id', 0)),
                        'professor_id': professor.get('id'),
                        'coordenador_masp': coordenador.get('coordenador_masp')
                    }
                    db.update(relacao_query, **relacao_dados)
                    db.commit()

                except Exception as e:
                    print(f"Erro ao atualizar relação: {e}")
                    db.rollback()


        return True

    @tratamento_excecao_db_grad_form()
    def buscar_formulario_ppgls(self, nome_formulario:str , data_inicio:str, db: DBConnectorGRADForm = None):
        

        if not nome_formulario or not data_inicio:
            raise ValueError("Os parâmetros 'nome_formulario' e 'data_inicio' são obrigatórios.")

        # Buscar dados na tabela residencia_especializacao_planilha
        query_residencia = """
        SELECT 
            re.id AS residencia_id
        FROM residencia_especializacao_professor_planilha rep
        JOIN residencia_especializacao_planilha re 
            ON rep.residencia_especializacao_id = re.id
        JOIN coordenador_planilha c 
            ON rep.coordenador_id = c.id
        JOIN professor_planilha p 
            ON rep.professor_id = p.id
        WHERE rep.nome_formulario = %(nome_formulario)s
        AND re.data_inicio = %(data_inicio)s
        LIMIT 1;
        """
        residencia = db.fetch_one(query_residencia, nome_formulario=nome_formulario, data_inicio=data_inicio)
        
        if not residencia:
            raise ValueError("Formulário não encontrado.")

        residencia_id = residencia['residencia_id']

        # Buscar coordenador relacionado
        query_coordenador_id = """
        SELECT coordenador_id FROM residencia_especializacao_professor_planilha
        WHERE residencia_especializacao_id = %(residencia_id)s
        LIMIT 1
        """
        coordenador_relacao = db.fetch_one(query_coordenador_id, residencia_id=residencia_id)
        
        coordenador = None
        if coordenador_relacao:
            coordenador_id = coordenador_relacao['coordenador_id']
            query_coordenador = """
            SELECT * FROM coordenador_planilha
            WHERE id = %(coordenador_id)s
            """
            coordenador = db.fetch_one(query_coordenador, coordenador_id=coordenador_id)

        # Buscar professores relacionados
        query_professores_id = """
        SELECT professor_id FROM residencia_especializacao_professor_planilha
        WHERE residencia_especializacao_id = %(residencia_id)s
        """
        professores_relacao = db.fetch_all(query_professores_id, residencia_id=residencia_id)

        professores = []
        for relacao in professores_relacao:
            professor_id = relacao['professor_id']
            query_professor = """
            SELECT * FROM professor_planilha
            WHERE id = %(professor_id)s
            """
            professor = db.fetch_one(query_professor, professor_id=professor_id)
            professores.append(professor)

        # Montar o resultado final
        resultado = {
            'residencia': residencia,
            'coordenador': coordenador,
            'professores': professores
        }
        
        return resultado

    
    @tratamento_excecao_db_grad_form()
    def excluir_formulario_ppgls(self, nome_formulario:str , data_inicio:str, db: DBConnectorGRADForm = None):    
        if not nome_formulario or not data_inicio:
            raise ValueError("Os parâmetros 'nome_formulario' e 'data_inicio' são obrigatórios.")

        # Verificar se o formulário existe
        query_verificar_formulario = """
        SELECT 1 FROM residencia_especializacao_professor_planilha
        WHERE nome_formulario = %(nome_formulario)s
        AND data_preenchimento = %(data_inicio)s
        LIMIT 1;
        """
        formulario_existe = db.fetch_one(query_verificar_formulario, nome_formulario=nome_formulario, data_inicio=data_inicio)
        
        if not formulario_existe:
            raise ValueError("Formulário não encontrado.")

        # Excluir as relações na tabela residencia_especializacao_professor_planilha
        query_delete_relacao = """
        DELETE FROM residencia_especializacao_professor_planilha
        WHERE nome_formulario = %(nome_formulario)s
        AND data_preenchimento = %(data_inicio)s;
        """
        db.delete(query_delete_relacao, nome_formulario=nome_formulario, data_inicio=data_inicio)
        db.commit()

        return True


    
   
queries_PPGLS = QueriesPPGLS()
