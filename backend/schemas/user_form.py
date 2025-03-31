from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties
class UsuarioBase(BaseModel):
    idlattes: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_coordenador: bool = False
    is_admin : bool = False
    cpf : Optional[str] = None
    curso: Optional[str] = None


    def to_redis_dict(self):
        return {
            'idlattes': self.idlattes if self.idlattes is not None else '',
            'email': self.email,
            'name': self.name if self.name is not None else '',
            'is_active': int(self.is_active),
            'is_coordenador': int(self.is_coordenador),
            'is_admin': int(self.is_admin),
            'cpf':self.cpf,
            'curso': self.curso if self.curso is not None else '',
        }

    @staticmethod
    def from_redis_dict(rdict):
        return UsuarioBase(
            idlattes= rdict['idlattes'],
            email= EmailStr(rdict['email']),
            name= rdict['name'],
            is_active= bool(int(rdict['is_active'])),
            is_coordenador= bool(int(rdict['is_coordenador'])),
            is_admin= bool(int(rdict['is_admin'])),
            cpf= rdict['cpf'],
            curso= rdict['curso'],
        )

class UsuarioFront(UsuarioBase):
    link_avatar : Optional[str] = None


# Properties to receive via API on creation
class UsuarioCriacao(UsuarioBase):
    
    password: str
    def dict_insert(self):
        return {
            "idlattes": self.idlattes,
            "email": self.email,
            "name": self.name,
            "is_active": self.is_active,
            "is_coordenador": self.is_coordenador,
            "is_admin": self.is_admin,
            "password": self.password,
            "cpf":self.cpf,
            "curso":self.curso,

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

