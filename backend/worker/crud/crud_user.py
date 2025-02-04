from typing import Optional
from backend.db.db import DBConnector
from backend.core.utils import InsertQuery, UpdateQuery
from backend.core.security import verify_password, get_password_hash
from backend.schemas.usuario import UsuarioAtualizacao, UsuarioNoBanco, Usuario, UsuarioCriacao, UsuarioFront
from backend.worker import crud
from backend.core.utils import tratamento_excecao_db_ppg

class CRUDUser():

    @tratamento_excecao_db_ppg()
    def retorna_dados_usuario_link_foto_lattes(self, email : str, db : DBConnector = None) ->tuple[Optional[UsuarioNoBanco], str]:
        """
        Retorna os dados do usuário e link para a foto do perfil lattes
        
        Retornos:
            user: Dados do usuário
            rowavatar: link para a foto do perfil lattes
        """
        query = "SELECT * FROM usuarios WHERE email = %(email)s"
        row = db.fetch_one(query, email = email)
        if row:
            dict_row = dict(row)
            user = UsuarioNoBanco(**dict_row, id_lattes=dict_row['idlattes'], nome = dict_row['full_name'])
            rowavatar = crud.queries_ppg.retorna_link_avatar_lattes(user.id_lattes, True)

            if row:
                return user, rowavatar
        return None, ""

    @tratamento_excecao_db_ppg()
    def verifica_usuario(self, idlattes : str, db: DBConnector = None) -> Optional[UsuarioFront]:
        """
        Verificando se existe o usuário no banco de dados
        """
        query = "SELECT * FROM usuarios where idlattes = %(idlattes)s"
        row = db.fetch_one(query, idlattes = idlattes)
        if row:
            dict_row = dict(row)
            user = UsuarioFront(**(dict_row),
                        id_lattes=dict_row['idlattes'],
                        nome = dict_row['full_name']
                    )
            return user
        return None
    
    @tratamento_excecao_db_ppg()
    def dados_complementares(self, id_ies : str, db: DBConnector = None) -> tuple[str, str]:
        """
        Retorna os dados complementares do usuário
        """
        query = "SELECT nome, sigla from instituicoes where id_ies = %(id_ies)s"
        row = db.fetch_one(query, id_ies = id_ies)
        if row:
            return row[0], row[1]
        return "", ""

    @tratamento_excecao_db_ppg()
    def criacao_usuario(self, novo_usuario : UsuarioCriacao, db: DBConnector = None) -> tuple[bool, str]:
        """
        Criando um novo usuário
        """
        try:
            novo_usuario.password = get_password_hash(novo_usuario.password)
            query = "INSERT INTO usuarios (idlattes, full_name, email, hashed_password, is_active, is_superuser, id_ies, is_admin) VALUES (%(id_lattes)s, %(nome)s, %(email)s, %(password)s, %(is_active)s, %(is_superuser)s,  %(id_ies)s, %(is_admin)s)"
            criacao_usuario = db.insert(query, **novo_usuario.dict())
            if criacao_usuario:
                return True, "Usuário criado com sucesso!"
            return False, "Não foi possível criar o usuário!"
        except Exception as e:
            return False, str(e)

    @tratamento_excecao_db_ppg()
    def atualizar_usuario(self, usuario_atualizacao : UsuarioAtualizacao, db: DBConnector = None) -> tuple[bool, str]:
        """
        Atualizando dados dos usuário no banco de dados
        """
        try:
            # update_query = UpdateQuery("usuarios", "idlattes", **obj_in)
            query = "UPDATE usuarios SET email = %(email)s, full_name = %(nome)s, id_ies = %(id_ies)s, is_active = %(is_active)s, is_superuser = %(is_superuser)s, is_admin = %(is_admin)s WHERE idlattes = %(idlattes)s"
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
    
    @tratamento_excecao_db_ppg()
    def alterar_senha_usuario(self, usuario: UsuarioAtualizacao, db: DBConnector = None) -> bool:
        try:
            query = "UPDATE usuarios SET hashed_password = %(hashed_password)s WHERE idlattes = %(idlattes)s"
            atualizacao = db.update(query, hashed_password = get_password_hash(usuario.password), idlattes = usuario.id_lattes)
            if atualizacao:
                return True
            return False
        except Exception as e:
            return False
    
    @tratamento_excecao_db_ppg()
    def alternar_ativo_usuario (self, id_lattes : str, db: DBConnector = None) -> tuple[bool, str]:
        """
        Atualizando dados dos usuário no banco de dados
        """
        try:
            query = "UPDATE usuarios SET is_active = NOT is_active WHERE idlattes = %(id_lattes)s"
            alternar = db.update(query, id_lattes = id_lattes)
            if alternar:
                return True, "Status do usuário alterado com sucesso!"
            return False, "Não foi possível alterar o status do usuário!"
        except Exception as e:
            return False, str(e)

    @tratamento_excecao_db_ppg()
    def autenticar_usuario(self, password: str, **kwargs) -> tuple[Optional[UsuarioNoBanco], str]:
        """
        Autenticando usuario no banco
        """
        try:
            user, useravatar = self.retorna_dados_usuario_link_foto_lattes(**kwargs)
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
        """
        Retorna se o usuário é ativo ou não -> Booleano
        """
        return user.is_active

    def is_superuser(self, user: Usuario) -> bool:
        """
        Retorna se o usuário é superusuario ou não -> Booleano
        """
        return user.is_superuser

    def is_admin(self, user: Usuario) -> bool:
        """
        Retorna se o usuário é administrador ou não -> Booleano
        """
        return user.is_admin

    @tratamento_excecao_db_ppg()
    def retorna_dados_usuario(self, idllates : str, db: DBConnector = None, **kwargs) -> Optional[Usuario]:
        """
        Retorna todos os dados do usuário
        """
        try:
            query = "SELECT * FROM usuarios where idllates = %(idllates)s"
            row = db.fetch_one(query, idllates = idllates)
            return Usuario(**row)
        except Exception as e:
            print(e)
            return None

    @tratamento_excecao_db_ppg()
    def retorna_lista_usuario(self, privilegio: bool, idlattes: str, id_ies : str, db: DBConnector = None) -> list[Optional[Usuario]]:
        """
        Retorna todos os usuários no banco
        """
        try:
            if privilegio:
                query = "SELECT * FROM usuarios order by full_name"
                rows = db.fetch_all(query)
                return [Usuario(**row, id_lattes=row['idlattes'], nome = row['full_name']) for row in rows]

            query = "SELECT * FROM usuarios where id_ies = %(id_ies)s  and is_superuser = false and (is_admin = false or idlattes = %(idlattes)s) order by full_name"
            rows = db.fetch_all(query, id_ies = id_ies, idlattes=idlattes)
            return [Usuario(**row, id_lattes=row['idlattes'], nome = row['full_name']) for row in rows]
        except Exception as e:
            print(e)
            return []
            
    @tratamento_excecao_db_ppg()
    def deletar_usuario(self, idlattes : str, db: DBConnector = None) -> tuple[bool, str]:
        """
        Retorna se o usuário foi deletado ou não
        """
        query = "DELETE from usuarios where idlattes = %(idlattes)s"
        deletado = db.delete(query, idlattes = idlattes)
        if deletado:
            return True, "Usuário deletado com sucesso!"
        return False, "Não foi possível deletar o usuário!"
    
    @tratamento_excecao_db_ppg()
    def retorna_lista_universidades(self, db: DBConnector = None) -> list[Optional[dict]]:
        """
        Retorna a lista de universidades
        """
        try:
            query = "SELECT id_ies, nome, sigla FROM instituicoes order by nome"
            rows = db.fetch_all(query)
            return [dict(row) for row in rows]
        except Exception as e:
            print(e)
            return []

user = CRUDUser()
