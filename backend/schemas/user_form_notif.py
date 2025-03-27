from typing import Optional
from pydantic import BaseModel  # Certifique-se de que estamos utilizando BaseModel
from datetime import datetime

# Shared properties
class UsuarioNotificacaoBase(BaseModel): 
    nome_usuario: str
    nome_formulario: Optional[str] = None
    data_preenchimento: Optional[datetime] = None
    preencheu: bool
    curso: Optional[str] = None

    def to_redis_dict(self):
        return {
            'nome_usuario': self.nome_usuario,
            'nome_formulario': self.nome_formulario if self.nome_formulario else '',
            'data_preenchimento': self.data_preenchimento.isoformat() if self.data_preenchimento else '',
            'preencheu': int(self.preencheu),
            'curso': self.curso,
        }

    @staticmethod
    def from_redis_dict(rdict):
        return UsuarioNotificacaoBase(
            nome_usuario=rdict['nome_usuario'],
            nome_formulario=rdict.get('nome_formulario'),
            data_preenchimento=datetime.fromisoformat(rdict['data_preenchimento']) if rdict.get('data_preenchimento') else None,
            preencheu=bool(int(rdict['preencheu'])),
            curso=rdict['curso'],
        )

# Additional properties to return via API
class UsuarioNotificacao(UsuarioNotificacaoBase):
    pass
