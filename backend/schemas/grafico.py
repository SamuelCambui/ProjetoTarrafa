import json
from typing import Optional
from pydantic import BaseModel

class DataSet(BaseModel):
    label: Optional[str] = ''
    data: Optional[list[float]] = []

class DadosGrafico(BaseModel):
    labels: Optional[list[str]] = []
    datasets: Optional[list[DataSet]] = []

class Grafico(BaseModel):
    data: Optional[DadosGrafico] = []
    
    def to_dict(self) -> dict:
        return json.loads(json.dumps(self, default=lambda o: o.__dict__))

""" -----------GRAFICO DE BARRAS---------------
class DataSet():
    label: Optional[str] = ''     #Titulo                   
    data: Optional[list[float]] = []  #dados media  

class DadosGrafico():
    labels: Optional[list[str]] = [] #ano_semestre
    datasets: Optional[list[DataSet]] = []

class Grafico():
    data: Optional[DadosGrafico] = []
"""