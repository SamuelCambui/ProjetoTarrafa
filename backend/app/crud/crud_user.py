from typing import Optional
#from DBConnectors import DBConnector
from backend.db.db import DBConnector

from backend.core.utils import InsertQuery, UpdateQuery
from backend.core.security import get_password_hash, verify_password
from backend.schemas.user import User, UserInDB
from backend.app import crud



class CRUDUser():

    async def get_user_db(self, db:DBConnector, **kwargs) ->Optional[User]:
        """
        Retorna os dados do usuário e link para a foto do perfil lattes
        
        Retornos:
            user: Dados do usuário
            rowavatar: link para a foto do perfil lattes
        """
        for key, value in kwargs.items():
            query = f"SELECT * FROM usuarios where {key} =" + "%(identifier)s"
            row = db.fetch_one(query, identifier = value)
            if row:
                user = UserInDB(**row)
                #query = f"SELECT linkavatar FROM public.curriculos_lattes where idlattes='{user.idlattes}'"
               # rowavatar = db.fetch_one(query)
                rowavatar = await crud.queries_ppg.retorna_link_avatar_lattes(user.idlattes, True, db)

                if row:
                    return user,rowavatar
            return None, None

    async def verify_in_db(self, db : DBConnector, **kwargs) -> Optional[User]:
        """
        Verificando se existe o usuário no banco de dados
        """
        for key, value in kwargs.items():
            query = f"SELECT * FROM usuarios where {key} = " + "%(identifier)s"
            row = db.fetch_one(query, identifier = value)
            if row:
                user = UserInDB(**row)
                return user
            return None

    async def retorna_dominios(self, db : DBConnector):
        """
        Retorna os domínios de emails cadastrados na tabela usuarios
        """
        
        query = "SELECT email FROM usuarios"
        rows = db.fetch_all(query)
        dominios = []
        if rows:
            for row in rows:
                if len(row) > 0 and row[0] != None:
                    dominios.append(row[0][row[0].index('@')+1:])
        dominios = list(set(dominios))
        dominios.sort()
        return dominios

    async def create(self, db: DBConnector, **obj_in) -> User:
        """
        Criando um novo usuário
        """
        db_obj = UserInDB(
            idlattes = obj_in['idlattes'],
            hashed_password=get_password_hash(obj_in['password']),
            email=obj_in['email'],
            full_name=obj_in['full_name'],
            is_active=obj_in['is_active'],
            is_superuser=obj_in['is_superuser'],
            is_admin=obj_in['is_admin'],
            id_ies = obj_in['id_ies'],
        )
        query = InsertQuery("usuarios", **dict(db_obj))
        return db.insert(query, **dict(db_obj))

    async def update_in_db(self, db: DBConnector, **obj_in) -> User:
        """
        Atualizando dados dos usuário no banco de dados
        """
        update_query = UpdateQuery("usuarios",'idlattes', **obj_in)
        return db.update(update_query, **obj_in)

    async def authenticate(self, db: DBConnector, *, password: str, **kwargs) -> Optional[User]:
        """
        Autenticando usuario no banco
        """
        user, useravatar = await self.get_user_db(db, **kwargs)
        if type(user) is not UserInDB:
            return None, None
        if not user:
            return None, None
        if not verify_password(password, user.hashed_password):
            return None, None

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

    async def get(self, db: DBConnector, **kwargs):
        """
        Retorna todos os dados do usuário
        """
        for key, value in kwargs.items():
            query = f"SELECT * FROM usuarios where {key} = " + "%(identifier)s"
            row = db.fetch_one(query, identifier = value)
        return User(**row)

    async def get_multi(self, privilegio: bool, idlattes: str, db: DBConnector, id_ies:str = None):
        """
        Retorna todos os usuários no banco
        """
        if privilegio == True:
            query = "SELECT * FROM usuarios order by full_name"
            row = db.fetch_all(query)

        else:
            query = "SELECT * FROM usuarios where id_ies = %(id_ies)s  and is_superuser = false and (is_admin = false or idlattes = %(idlattes)s) order by full_name"
            row = db.fetch_all(query, id_ies = id_ies, idlattes=idlattes)

        #logados = redis.scan('usuario:')
            
        return row

    async def delete_user(self, idlattes : str, db: DBConnector):
        """
        Retorna se o usuário foi deletado ou não
        """
        query = "DELETE from usuarios where idlattes = %(idlattes)s"
        return db.delete(query, idlattes = idlattes)

user = CRUDUser()
