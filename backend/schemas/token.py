from typing import Optional

from pydantic import BaseModel
from pydantic import EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str
    redirect: str
    avatar: Optional[str] = None
    nome: Optional[str] = None
    email : Optional[str] = None
    idlattes: Optional[str] = None


class TokenPayload(BaseModel):
    sub: Optional[EmailStr] = None