from typing import Optional
from backend.db.db import DBConnector
from backend.core.utils import InsertQuery, UpdateQuery
from backend.core.security import verify_password, get_password_hash
from backend.schemas.user import User, UserInDB
from backend.worker import crud
from backend.core.utils import tratamento_excecao_db_ppg

class CRUDUser():

    @tratamento_excecao_db_ppg()
    def get_user_db(self, db : DBConnector = None, **kwargs) ->tuple[Optional[UserInDB], str]:
        """
        Retorna os dados do usuário e link para a foto do perfil lattes
        
        Retornos:
            user: Dados do usuário
            rowavatar: link para a foto do perfil lattes
        """
        key, value = next(iter(kwargs.items()))
        query = f"SELECT * FROM usuarios WHERE {key} = %(identifier)s"
        row = db.fetch_one(query, identifier = value)
        if row:
            user = UserInDB(**row)
            nome_ies, sigla_ies = self.dados_complementares(user.id_ies)
            user.nome_ies = nome_ies
            user.sigla_ies = sigla_ies
            #query = f"SELECT linkavatar FROM public.curriculos_lattes where idlattes='{user.idlattes}'"
            # rowavatar = db.fetch_one(query)
            rowavatar = crud.queries_ppg.retorna_link_avatar_lattes(user.idlattes, True)

            if row:
                return user, rowavatar
        return None, ""

    @tratamento_excecao_db_ppg()
    def verify_in_db(self, db: DBConnector = None, **kwargs) -> Optional[UserInDB]:
        """
        Verificando se existe o usuário no banco de dados
        """
        key, value = next(iter(kwargs.items()))
        query = f"SELECT * FROM usuarios where {key} = " + "%(identifier)s"
            # print(query)
        row = db.fetch_one(query, identifier = value)
        if row:
            user = UserInDB(**row)
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
    def create(self, db: DBConnector = None, **obj_in) -> tuple[bool, str]:
        """
        Criando um novo usuário
        """
        try:
            db_obj = UserInDB(
                idlattes = obj_in['idLattes'],
                hashed_password=get_password_hash(obj_in['password']),
                email=obj_in['email'],
                full_name=obj_in['nome'],
                is_active=obj_in['isActive'],
                is_superuser=obj_in['isSuperuser'],
                is_admin=obj_in['isAdmin'],
                id_ies = obj_in['idIes'],
            )
            # query = InsertQuery("usuarios", **db_obj.dict())
            query = "INSERT INTO usuarios VALUES (%(idlattes)s, %(hashed_password)s, %(email)s, %(full_name)s, %(is_active)s, %(is_superuser)s, %(is_admin)s, %(id_ies)s)"
            criacao_usuario = db.insert(query, **db_obj.dict())
            if criacao_usuario:
                return True, "Usuário criado com sucesso!"
            return False, "Não foi possível criar o usuário!"
        except Exception as e:
            return False, str(e)

    @tratamento_excecao_db_ppg()
    def update_in_db(self, db: DBConnector, **obj_in) -> User:
        """
        Atualizando dados dos usuário no banco de dados
        """
        update_query = UpdateQuery("usuarios","idlattes", **obj_in)
        query = "UPDATE usuarios SET %(update_query)s WHERE idlattes = %(idlattes)s"
        return db.update(update_query, **obj_in)
    
    @tratamento_excecao_db_ppg()
    def alternar_usuario (self, id_lattes : str, db: DBConnector = None) -> tuple[bool, str]:
        """
        Atualizando dados dos usuário no banco de dados
        """
        query = "UPDATE usuarios SET is_active = NOT is_active WHERE idlattes = %(id_lattes)s"
        alternar = db.update(query, id_lattes = id_lattes)
        if alternar:
            return True, "Status do usuário alterado com sucesso!"
        return False, "Não foi possível alterar o status do usuário!"

    @tratamento_excecao_db_ppg()
    def authenticate(self, password: str, **kwargs) -> tuple[Optional[UserInDB], str]:
        """
        Autenticando usuario no banco
        """
        user, useravatar = self.get_user_db(**kwargs)
        if type(user) is not UserInDB:
            return None, ""
        if not user:
            return None, ""
        if not verify_password(password, user.hashed_password):
            return None, ""

        return user, useravatar


    def is_active(self, user: User) -> bool:
        """
        Retorna se o usuário é ativo ou não -> Booleano
        """
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        """
        Retorna se o usuário é superusuario ou não -> Booleano
        """
        return user.is_superuser

    def is_admin(self, user: User) -> bool:
        """
        Retorna se o usuário é administrador ou não -> Booleano
        """
        return user.is_admin

    @tratamento_excecao_db_ppg()
    def get(self, db: DBConnector = None, **kwargs) -> Optional[User]:
        """
        Retorna todos os dados do usuário
        """
        try:
            key, value = next(iter(kwargs.items()))
            query = f"SELECT * FROM usuarios where {key} = " + "%(identifier)s"
            row = db.fetch_one(query, identifier = value)
            return User(**row)
        except Exception as e:
            return None

    @tratamento_excecao_db_ppg()
    def get_multi(self, privilegio: bool, idlattes: str, id_ies : str, db: DBConnector = None) -> list[User]:
        """
        Retorna todos os usuários no banco
        """
        if privilegio:
            query = "SELECT * FROM usuarios order by full_name"
            rows = db.fetch_all(query)
            return [User(**row) for row in rows]

        query = "SELECT * FROM usuarios where id_ies = %(id_ies)s  and is_superuser = false and (is_admin = false or idlattes = %(idlattes)s) order by full_name"
        rows = db.fetch_all(query, id_ies = id_ies, idlattes=idlattes)
        return [User(**row) for row in rows]

        #logados = redis.scan('usuario:')
            
    @tratamento_excecao_db_ppg()
    def delete_user(self, idlattes : str, db: DBConnector = None) -> bool:
        """
        Retorna se o usuário foi deletado ou não
        """
        query = "DELETE from usuarios where idlattes = %(idlattes)s"
        return db.delete(query, idlattes = idlattes)

user = CRUDUser()
