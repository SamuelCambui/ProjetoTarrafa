from pydantic import BaseModel
from typing import Optional

class PopUp(BaseModel):
    nome_popup: Optional[str] = None
    src_imagem: Optional[str] = None
    txt_titulo:Optional[str] = None
    classe_titulo:Optional[str] = None
    txt_conteudo: Optional[str] = None
    classe_conteudo:Optional[str] = None
    txt_botao:Optional[str] = None
    classe_botao:Optional[str] = None
    logout_forcado:Optional[bool] = False
    popup_ativo:Optional[bool] = False
    