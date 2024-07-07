from backend.db.db import DBConnector
from backend import schemas

from backend.core import utils
from itertools import combinations

from datetime import datetime, timedelta

from typing import List

#db = deps.get_db_grad()

class QueriesGrad():
    
    def inserir_usuarios_formulario(self, db: DBConnector, **kwargs):
        query = utils.InsertQuery('formulario', **kwargs)
        ret = db.insert(query, **kwargs)
        if ret:
            return True
        return False
    
    def verifica_pendencia_formulario(self, cpf: str, db: DBConnector):
        ret = db.fetch_one('''select * from formulario where cpf = %(cpf)s''',cpf=cpf)
        if ret:
            return False
        return True

queries_grad = QueriesGrad()