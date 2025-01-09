from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties
class UserBase(BaseModel):
    idlattes: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    is_admin : bool = False
    id_ies: Optional[str] = None
    nome_ies: Optional[str] = None
    sigla_ies: Optional[str] = None

    def to_redis_dict(self):
        return {
            'idlattes': self.idlattes if self.idlattes is not None else '',
            'email': self.email,
            'full_name': self.full_name if self.full_name is not None else '',
            'is_active': int(self.is_active),
            'is_superuser': int(self.is_superuser),
            'is_admin': int(self.is_admin),
            'id_ies':self.id_ies
        }

    @staticmethod
    def from_redis_dict(rdict):
        return UserBase(
            idlattes= rdict['idlattes'],
            email= EmailStr(rdict['email']),
            full_name= rdict['full_name'],
            is_active= bool(int(rdict['is_active'])),
            is_superuser= bool(int(rdict['is_superuser'])),
            is_admin= bool(int(rdict['is_admin'])),
            id_ies=rdict['id_ies']
        )

# Properties to receive via API on creation
class UserCreate(UserBase):
    idlattes: str
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    email : Optional[str] = None
    password: Optional[str] = None
    is_admin : Optional[bool] = False


# Additional properties to return via API
class User(UserBase):
    pass


# Additional properties stored in DB
class UserInDB(UserBase):
    hashed_password: str