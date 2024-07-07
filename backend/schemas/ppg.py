from typing import Optional,List

from pydantic import BaseModel

class ListaNegra(BaseModel):
    lista_negra: Optional[List[str]] = None