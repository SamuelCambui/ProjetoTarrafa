from backend.db.db import DBConnectorGRAD
from backend.core.utils import tratamento_excecao_com_db
from backend.app import schemas

from backend.app.core import utils
from itertools import combinations

from datetime import datetime, timedelta

from typing import List

#db = deps.get_db_grad()

class QueriesPPGLS():

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
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def inserir_formulario_ppgls(self, db: DBConnectorGRAD = None, **kwargs):
        nome_formulario = kwargs.get('nome_formulario')
        data_inicio = kwargs.get('data_inicio')
        
        # Verificar se o formulário já existe
        query_verificar = """
        SELECT 1 FROM residencia_especializacao_planilha 
        WHERE nome = %(nome)s 
        AND data_inicio = %(data_inicio)s
        """
        existe = db.fetch_one(query_verificar, nome=kwargs.get('nome'), data_inicio=data_inicio)
        
        if existe:
            raise ValueError("Formulário já existe para este nome e data de início.")
        

        residencia_dados = {
            'nome': kwargs.get('nome'),
            'data_inicio': data_inicio,
            'data_termino': kwargs.get('data_termino'),
            'vagas_ofertadas': kwargs.get('vagas_ofertadas'),
            'vagas_preenchidas': kwargs.get('vagas_preenchidas'),
            'categoria_profissional': kwargs.get('categoria_profissional')
        }
        
        # Inserir residência/especialização
        residencia_query = utils.InsertQuery(
            'residencia_especializacao_planilha',
            **residencia_dados
        )
        residencia_id = db.insert(residencia_query)
        
        

        coordenador_dados = {
            'nome_formulario': nome_formulario,
            'nome': kwargs.get('coordenador_nome')
        }
        # Inserir coordenador
        coordenador_query = utils.InsertQuery(
            'coordenador_planilha',
            **coordenador_dados
        )
        coordenador_id = db.insert(coordenador_query)

        
        # Inserir professores e associá-los à residência/especialização
        professores = kwargs.get('professores', [])
        for professor_dados in professores:
            professor_query = utils.InsertQuery(
                'professor_planilha',
                **professor_dados
            )
            professor_id = db.insert(professor_query)
            
            # Inserir relação entre residência/especialização, professor e coordenador
            relacao_query = utils.InsertQuery(
                'residencia_especializacao_professor_planilha',
                nome_formulario=nome_formulario,
                data_preenchimento=kwargs.get('data_preenchimento'),
                residencia_especializacao_id=residencia_id,
                professor_id=professor_id,
                coordenador_id=coordenador_id
            )
            db.insert(relacao_query)
        
        return True
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def excluir_formulario_ppgls(self, db: DBConnectorGRAD = None, **kwargs):
        nome_formulario = kwargs.get('nome_formulario')
        data_inicio = kwargs.get('data_inicio')
        
        # Verificar se o formulário existe
        query_verificar = """
        SELECT id FROM residencia_especializacao_planilha 
        WHERE nome = %(nome)s 
        AND data_inicio = %(data_inicio)s
        """
        residencia = db.fetch_one(query_verificar, nome=kwargs.get('nome'), data_inicio=data_inicio)
        
        if not residencia:
            raise ValueError("Formulário não encontrado.")
        
        residencia_id = residencia['id']
        
        # Encontrar os IDs relacionados na tabela de relação usando data_inicio
        query_relacoes = """
            SELECT professor_id, coordenador_id
            FROM residencia_especializacao_professor_planilha
            WHERE residencia_especializacao_id = %(residencia_id)s

        """
        relacoes = db.fetch_all(query_relacoes, residencia_id=residencia_id)
        
        for relacao in relacoes:
        
            professor_id = relacao['professor_id']
            coordenador_id = relacao['coordenador_id']
            
            # Remover relação na tabela de relação
            query_remover_relacao = """
            DELETE FROM residencia_especializacao_professor_planilha
            WHERE residencia_especializacao_id = %(residencia_id)s
            AND professor_id = %(professor_id)s
            AND coordenador_id = %(coordenador_id)s
            """
            db.execute(query_remover_relacao, residencia_id=residencia_id, professor_id=professor_id, coordenador_id=coordenador_id)

            # (Opcional) Remover professor se não tiver outras relações
            query_verificar_professor = """
            SELECT 1 FROM residencia_especializacao_professor_planilha
            WHERE professor_id = %(professor_id)s
            """
            if not db.fetch_one(query_verificar_professor, professor_id=professor_id):
                query_remover_professor = """
                DELETE FROM professor_planilha
                WHERE id = %(professor_id)s
                """
                db.execute(query_remover_professor, professor_id=professor_id)
            
            # (Opcional) Remover coordenador se não tiver outras relações
            query_verificar_coordenador = """
            SELECT 1 FROM residencia_especializacao_professor_planilha
            WHERE coordenador_id = %(coordenador_id)s
            """
            if not db.fetch_one(query_verificar_coordenador, coordenador_id=coordenador_id):
                query_remover_coordenador = """
                DELETE FROM coordenador_planilha
                WHERE id = %(coordenador_id)s
                """
                db.execute(query_remover_coordenador, coordenador_id=coordenador_id)
        
        # Remover o registro na tabela de residência/especialização
        query_remover_residencia = """
        DELETE FROM residencia_especializacao_planilha
        WHERE id = %(residencia_id)s
        """
        db.execute(query_remover_residencia, residencia_id=residencia_id)
        
        return True
    
    @tratamento_excecao_com_db(tipo_banco='grad')
    def alterar_formulario_ppgls(self, db: DBConnectorGRAD = None, **kwargs):
        nome_formulario = kwargs.get('nome_formulario')
        data_inicio = kwargs.get('data_inicio')

        # Verificar se o formulário existe
        query_verificar = """
        SELECT id FROM residencia_especializacao_planilha 
        WHERE nome_formulario = %(nome_formulario)s 
        AND data_inicio = %(data_inicio)s
        """
        residencia_id = db.fetch_one(query_verificar, nome_formulario=nome_formulario, data_inicio=data_inicio)

        if not residencia_id:
            raise ValueError("Formulário não encontrado.")

        # Atualizar os dados na tabela residencia_especializacao_planilha
        residencia_dados = {
            'nome_formulario': nome_formulario,
            'data_preenchimento': kwargs.get('data_preenchimento'),
            'nome': kwargs.get('nome'),
            'data_inicio': data_inicio,
            'data_termino': kwargs.get('data_termino'),
            'vagas_ofertadas': kwargs.get('vagas_ofertadas'),
            'vagas_preenchidas': kwargs.get('vagas_preenchidas'),
            'categoria_profissional': kwargs.get('categoria_profissional')
        }

        query_atualizar_residencia = utils.UpdateQuery(
            'residencia_especializacao_planilha',
            set_fields=residencia_dados,
            where_conditions={'id': residencia_id}
        )
        db.execute(query_atualizar_residencia)

        # Atualizar coordenador
        coordenador_id = kwargs.get('coordenador_id')
        coordenador_dados = {
            'nome_formulario': nome_formulario,
            'data_preenchimento': kwargs.get('data_preenchimento'),
            'nome': kwargs.get('coordenador_nome')
        }
        query_atualizar_coordenador = utils.UpdateQuery(
            'coordenador_planilha',
            set_fields=coordenador_dados,
            where_conditions={'id': coordenador_id}
        )
        db.execute(query_atualizar_coordenador)

        # Atualizar professores
        professores = kwargs.get('professores', [])
        for professor_dados in professores:
            professor_id = professor_dados.get('professor_id')
            professor_dados_update = {
                'nome_formulario': nome_formulario,
                'data_preenchimento': kwargs.get('data_preenchimento'),
                'vinculo': professor_dados.get('vinculo'),
                'titulacao': professor_dados.get('titulacao'),
                'carga_horaria': professor_dados.get('carga_horaria')
            }
            query_atualizar_professor = utils.UpdateQuery(
                'professor_planilha',
                set_fields=professor_dados_update,
                where_conditions={'id': professor_id}
            )
            db.execute(query_atualizar_professor)

            # Atualizar relação entre residência/especialização, professor e coordenador
            relacao_dados = {
                'residencia_especializacao_id': residencia_id,
                'professor_id': professor_id,
                'coordenador_id': coordenador_id
            }
            query_atualizar_relacao = utils.UpdateQuery(
                'residencia_especializacao_professor_planilha',
                set_fields=relacao_dados,
                where_conditions={'id': professor_dados.get('relacao_id')}
            )
            db.execute(query_atualizar_relacao)

        return True


    @tratamento_excecao_com_db(tipo_banco='grad')
    def buscar_formulario_ppgls(self, db: DBConnectorGRAD = None, **kwargs):
        nome_formulario = kwargs.get('nome_formulario')
        data_inicio = kwargs.get('data_inicio')

        # Buscar dados na tabela residencia_especializacao_planilha
        query_residencia = """
        SELECT * FROM residencia_especializacao_planilha
        WHERE nome_formulario = %(nome_formulario)s
        AND data_inicio = %(data_inicio)s
        """
        residencia = db.fetch_one(query_residencia, nome_formulario=nome_formulario, data_inicio=data_inicio)
        
        if not residencia:
            raise ValueError("Formulário não encontrado.")

        residencia_id = residencia['id']

        # Buscar coordenador relacionado
        query_coordenador_id = """
        SELECT coordenador_id FROM residencia_especializacao_professor_planilha
        WHERE residencia_especializacao_id = %(residencia_id)s
        LIMIT 1
        """
        coordenador_relacao = db.fetch_one(query_coordenador_id, residencia_id=residencia_id)
        
        if coordenador_relacao:
            coordenador_id = coordenador_relacao['coordenador_id']
            query_coordenador = """
            SELECT * FROM coordenador_planilha
            WHERE id = %(coordenador_id)s
            """
            coordenador = db.fetch_one(query_coordenador, coordenador_id=coordenador_id)
        else:
            coordenador = None

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

        # Montar o resultado
        resultado = {
            'residencia': residencia,
            'coordenador': coordenador,
            'professores': professores
        }
        
        return resultado

   
queries_PPGLS = QueriesPPGLS()
