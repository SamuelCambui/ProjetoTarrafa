from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties
class UsuarioBase(BaseModel):
    idlattes: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_coordenadaor: bool = False
    is_admin : bool = False


    def to_redis_dict(self):
        return {
            'idlattes': self.idlattes if self.idlattes is not None else '',
            'email': self.email,
            'full_name': self.full_name if self.full_name is not None else '',
            'is_active': int(self.is_active),
            'is_coordenadaor': int(self.is_coordenadaor),
            'is_admin': int(self.is_admin)
        }

    @staticmethod
    def from_redis_dict(rdict):
        return UsuarioBase(
            idlattes= rdict['idlattes'],
            email= EmailStr(rdict['email']),
            full_name= rdict['full_name'],
            is_active= bool(int(rdict['is_active'])),
            is_coordenadaor= bool(int(rdict['is_coordenadaor'])),
            is_admin= bool(int(rdict['is_admin']))
        )

class UsuarioFront(UsuarioBase):
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
            "is_coordenador": self.is_coordenador,
            "is_admin": self.is_admin,
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

