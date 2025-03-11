from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties
class UsuarioBase(BaseModel):
    id_lattes: Optional[str] = None
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    is_admin : bool = False
    id_ies: Optional[str] = None
    nome_ies: Optional[str] = None
    sigla_ies: Optional[str] = None

    def to_redis_dict(self):
        return {
            'idlattes': self.id_lattes if self.id_lattes is not None else '',
            'email': self.email,
            'nome': self.nome if self.nome is not None else '',
            'is_active': int(self.is_active),
            'is_superuser': int(self.is_superuser),
            'is_admin': int(self.is_admin),
            'id_ies':self.id_ies
        }

    @staticmethod
    def from_redis_dict(rdict):
        return UsuarioBase(
            id_lattes = rdict['idlattes'],
            email = EmailStr(rdict['email']),
            nome = rdict['full_name'],
            is_active = bool(int(rdict['is_active'])),
            is_superuser = bool(int(rdict['is_superuser'])),
            is_admin = bool(int(rdict['is_admin'])),
            id_ies = rdict['id_ies']
        )

class UsuarioFront(UsuarioBase):
    nome_ies: Optional[str] = None
    sigla_ies: Optional[str] = None
    link_avatar : Optional[str] = None


# Properties to receive via API on creation
class UsuarioCriacao(UsuarioBase):
    password: str

    def dict_insert(self):
        return {
            "idlattes": self.id_lattes,
            "email": self.email,
            "nome": self.nome,
            "is_active": self.is_active,
            "is_superuser": self.is_superuser,
            "is_admin": self.is_admin,
            "id_ies": self.id_ies,
            "password": self.password
        }


# Properties to receive via API on update
class UsuarioAtualizacao(UsuarioBase):
    password: Optional[str] = None



# Additional properties to return via API
class Usuario(UsuarioBase):
    pass


# Additional properties stored in DB
class UsuarioNoBanco(UsuarioBase):
    hashed_password: str = ""

