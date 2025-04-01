import traceback
from typing import Optional

from backend.core.security import get_password_hash, verify_password
from backend.core.utils import tratamento_excecao_db_grad_form
from backend.db.db import DBConnectorGRADForm
from backend.schemas.user_form import (
    Usuario,
    UsuarioAtualizacao,
    UsuarioCriacao,
    UsuarioFront,
    UsuarioNoBanco,
)
from backend.schemas.user_form_notif import UsuarioNotificacao
from backend.worker import crud


class CRUDUser:
    @tratamento_excecao_db_grad_form()
    def retorna_dados_usuario_link_foto_lattes(
        self, email: str, db: DBConnectorGRADForm = None
    ) -> tuple[Optional[UsuarioNoBanco], str]:
        """
        Retorna os dados do usuário e link para a foto do perfil Lattes.

        Retornos:
            user: Dados do usuário
            rowavatar: Link para a foto do perfil Lattes
        """
        print(
            f"[DEBUG] Iniciando consulta para email: {email}"
        )  # Verifica a entrada da função

        query = "SELECT * FROM usuarios WHERE email = %(email)s"
        row = db.fetch_one(query, email=email)

        if row:
            print(
                f"[DEBUG] Registro encontrado no banco: {row}"
            )  # Verifica se encontrou o usuário

            dict_row = dict(row)

            # Verificando se os campos existem antes de criar a instância
            print(f"[DEBUG] Campos extraídos: {dict_row.keys()}")

            try:
                user = UsuarioNoBanco(
                    **dict_row
                )  # Corrigindo para usar apenas `dict_row`
                print(f"[DEBUG] Objeto UsuarioNoBanco criado com sucesso: {user}")

                # Obtendo o link do avatar
                rowavatar = (
                    crud.queries_ppg.retorna_link_avatar_lattes(user.idlattes, True)
                    if user.idlattes
                    else ""
                )
                print(f"[DEBUG] Link do avatar retornado: {rowavatar}")

                return user, rowavatar
            except Exception as e:
                print(
                    f"[ERRO] Falha ao criar UsuarioNoBanco: {e}"
                )  # Captura erros ao instanciar o usuário

        print("[DEBUG] Nenhum registro encontrado ou erro na criação do objeto.")
        return None, ""

    @tratamento_excecao_db_grad_form()
    def verifica_usuario(
        self, idlattes: str, db: DBConnectorGRADForm = None
    ) -> Optional[UsuarioFront]:
        """
        Verificando se existe o usuário no banco de dados
        """
        query = "SELECT * FROM usuarios where idlattes = %(idlattes)s"
        row = db.fetch_one(query, idlattes=idlattes)
        if row:
            dict_row = dict(row)
            user = UsuarioFront(
                **(dict_row), idlattes=dict_row["idlattes"], name=dict_row["name"]
            )
            return user
        return None

    @tratamento_excecao_db_grad_form()
    def criacao_usuario(
        self, novo_usuario: UsuarioCriacao, db: DBConnectorGRADForm = None
    ) -> tuple[bool, str]:
        """
        Criando um novo usuário
        """
        print("Dados do UsuarioCriacao:")
        print(novo_usuario)
        try:
            novo_usuario.password = get_password_hash(novo_usuario.password)
            # Verificar se o cpf foi fornecido, caso contrário, substitui por None
            novo_usuario.cpf = novo_usuario.cpf if novo_usuario.cpf else None
            novo_usuario.curso = novo_usuario.curso if novo_usuario.curso else None
            query = "INSERT INTO usuarios (idlattes, name, email, hashed_password, is_active, is_coordenador, is_admin, cpf, curso) VALUES (%(idlattes)s, %(name)s, %(email)s, %(password)s, %(is_active)s, %(is_coordenador)s, %(is_admin)s, %(cpf)s, %(curso)s)"
            criacao_usuario = db.insert(query, **novo_usuario.dict())

            if criacao_usuario:
                return True, "Usuário criado com sucesso!"
            return False, "Não foi possível criar o usuário"

        except Exception as e:
            erro_traceback = traceback.format_exc()  # Captura o traceback completo
            print(f"Erro ao criar usuário: {erro_traceback}")  # Log no console
            return False, str(e)

    @tratamento_excecao_db_grad_form()
    def atualizar_usuario(
        self, usuario_atualizacao: UsuarioAtualizacao, db: DBConnectorGRADForm = None
    ) -> tuple[bool, str]:
        """
        Atualizando dados do usuário no banco de dados
        """
        try:
            usuario_atualizacao.cpf = (
                usuario_atualizacao.cpf if usuario_atualizacao.cpf else None
            )
            usuario_atualizacao.curso = (
                usuario_atualizacao.curso if usuario_atualizacao.curso else None
            )
            query = "UPDATE usuarios SET email = %(email)s, name = %(name)s, is_active = %(is_active)s, is_coordenador = %(is_coordenador)s, is_admin = %(is_admin)s, cpf = %(cpf)s, curso = %(curso)s  WHERE idlattes = %(idlattes)s"
            atualizacao = db.update(query, **usuario_atualizacao.dict())
            if not atualizacao:
                return False, "Não foi possível atualizar o usuário!"
            if usuario_atualizacao.password:
                atualizacao_senha = self.alterar_senha_usuario(usuario_atualizacao)
                if not atualizacao_senha:
                    return False, "Não foi possível atualizar a senha do usuário!"
            return True, "Usuário atualizado com sucesso!"

        except Exception as e:
            return False, str(e)

    @tratamento_excecao_db_grad_form()
    def alterar_senha_usuario(
        self, usuario: UsuarioAtualizacao, db: DBConnectorGRADForm = None
    ) -> bool:
        """
        Alterna o status do usuário (ativo/inativo)
        """
        try:
            query = "UPDATE usuarios SET hashed_password = %(hashed_password)s WHERE idlattes = %(idlattes)s"
            atualizacao = db.update(
                query,
                hashed_password=get_password_hash(usuario.password),
                idlattes=usuario.idlattes,
            )
            if atualizacao:
                return True
            return False
        except Exception as e:
            return False

    @tratamento_excecao_db_grad_form()
    def alternar_ativo_usuario(
        self, idlattes: str, db: DBConnectorGRADForm = None
    ) -> tuple[bool, str]:
        """
        Atualizando dados dos usuário no banco de dados
        """
        try:
            query = "UPDATE usuarios SET is_active = NOT is_active WHERE idlattes = %(idlattes)s"
            alternar = db.update(query, idlattes=idlattes)
            if alternar:
                return True, "Status do usuário alterado com sucesso!"
            return False, "Não foi possível alterar o status do usuário!"
        except Exception as e:
            return False, str(e)

    @tratamento_excecao_db_grad_form()
    def autenticar_usuario(
        self, db: DBConnectorGRADForm = None, *, password: str, **kwargs
    ) -> tuple[Optional[UsuarioNoBanco], str]:
        """
        Autenticando usuário no banco
        """
        try:
            user, useravatar = self.retorna_dados_usuario_link_foto_lattes(**kwargs)
            if user is None:
                return None, "Usuário não encontrado"

            if not isinstance(user, UsuarioNoBanco):
                return UsuarioNoBanco(), ""
            if not user:
                return UsuarioNoBanco(), ""
            if not verify_password(password, user.hashed_password):
                return UsuarioNoBanco(), ""

            return user, useravatar
        except Exception as e:
            return None, str(e)

    def is_active(self, user: Usuario) -> bool:
        """Retorna se o usuário é ativo ou não -> Booleano"""
        return user.is_active

    def is_coordenador(self, user: Usuario) -> bool:
        """Verifica se o usuário é coordenador"""
        return user.is_coordenador

    def is_admin(self, user: Usuario) -> bool:
        """Verifica se o usuário é administrador"""
        return user.is_admin

    @tratamento_excecao_db_grad_form()
    def retorna_dados_usuario(
        self, idllates: str, db: DBConnectorGRADForm = None
    ) -> Optional[Usuario]:
        """
        Retorna os dados do usuário
        """
        try:
            query = "SELECT * FROM usuarios where idllates = %(idllates)s"
            row = db.fetch_one(query, idllates=idllates)
            return Usuario(**row)
        except Exception as e:
            print(e)
            return None

    @tratamento_excecao_db_grad_form()
    def deletar_usuario(
        self, idlattes: str, db: DBConnectorGRADForm = None
    ) -> tuple[bool, str]:
        """
        Remove um usuário do banco de dados
        """
        query = "DELETE FROM usuarios WHERE idlattes = %(idlattes)s"
        sucesso = db.delete(query, idlattes=idlattes)
        if sucesso:
            return True, "Usuário deletado com sucesso!"
        return False, "Não foi possível deletar o usuário!"

    @tratamento_excecao_db_grad_form()
    def retorna_lista_usuario(
        self, is_admin: bool, db: DBConnectorGRADForm = None
    ) -> list[Optional[Usuario]]:
        """
        Retorna todos os usuários no banco
        """
        try:
            if is_admin:
                query = "SELECT * FROM usuarios order by name"
                rows = db.fetch_all(query)
                return [Usuario(**row) for row in rows]

        except Exception as e:
            print(e)
            return []

    @tratamento_excecao_db_grad_form()
    def obter_status_preenchimento_formulario(
        self, is_coordenador: bool, ano: int, db: DBConnectorGRADForm = None
    ) -> list[Optional[UsuarioNotificacao]]:
        """
        Retorna todos os usuários no banco
        """
        try:
            if is_coordenador:
                query = """
                    SELECT DISTINCT 
                        u.name AS nome_usuario,
                        NULL AS nome_formulario,  -- Para alinhar as colunas
                        CAST(NULL AS TIMESTAMP) AS data_preenchimento,  -- Correção aqui!
                        FALSE AS preencheu,  -- Valor fixo FALSE para quem não preencheu
                        u.curso  -- Adicionando o curso dos usuários que não preencheram
                    FROM 
                        usuarios u
                    LEFT JOIN 
                        coordenador_planilha c ON u.cpf = c.id  -- Alterado para usar 'id' da tabela 'coordenador_planilha'
                    LEFT JOIN 
                        coordenador_carga_horaria ch ON c.id = ch.coordenador_id
                    LEFT JOIN 
                        residencia_especializacao_professor_planilha resp 
                        ON ch.id = resp.coordenador_carga_horaria_id 
                        AND EXTRACT(YEAR FROM resp.data_preenchimento) = %(ano)s
                    WHERE 
                        u.is_active = TRUE  -- Somente usuários ativos
                        AND u.is_coordenador = FALSE  -- Que não sejam coordenadores
                        AND u.is_admin = FALSE  -- E que não sejam administradores
                        AND resp.id IS NULL  -- Garantir que não preencheu o formulário

                    UNION

                    SELECT DISTINCT 
                        c.nome AS nome_usuario, 
                        resp.nome_formulario,
                        resp.data_preenchimento,
                        TRUE AS preencheu,  -- Valor fixo TRUE para quem preencheu
                        u.curso  -- Adicionando o curso dos usuários que preencheram
                    FROM 
                        residencia_especializacao_professor_planilha resp
                    JOIN 
                        coordenador_carga_horaria ch ON ch.id = resp.coordenador_carga_horaria_id
                    JOIN 
                        coordenador_planilha c ON c.id = ch.coordenador_id
                    JOIN 
                        usuarios u ON u.cpf = c.id  -- Alterado para fazer a junção correta
                    WHERE 
                        EXTRACT(YEAR FROM resp.data_preenchimento) = %(ano)s
                    ORDER BY 
                        nome_usuario;
                """
                # Executa a consulta no banco
                rows = db.fetch_all(query, ano=ano)

                return [
                    UsuarioNotificacao(
                        nome_usuario=row[0],
                        nome_formulario=row[1],
                        data_preenchimento=row[2],
                        preencheu=row[3],
                        curso=row[4],
                    )
                    for row in rows
                ]

        except Exception as e:
            print(e)
            return []


user = CRUDUser()
