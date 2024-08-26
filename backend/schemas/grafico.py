from enum import Enum
from typing import Optional


class DataSet():
    label: Optional[str] = ''     #dataset1                     #dataset2
    data: Optional[list[float]] = []  #30   #10   #50  #null     #70 #-50   

class DadosGrafico():
    labels: Optional[list[str]] = [] #janeiro #fevereiro... july
    datasets: Optional[list[DataSet]] = []

class Grafico():
    data: Optional[DadosGrafico] = []


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
