import pytest
import os
import sys

from pathlib import Path

diretorio_raiz = Path(__name__).resolve().parent.parent
sys.path.append(str(diretorio_raiz))
print(str(diretorio_raiz))

from backend.worker import crud
from backend.schemas.user import User, UserInDB
from backend.db.db import DBConnectorPPG
from dotenv import load_dotenv


@pytest.fixture(scope="module")
def db_connection():
    db = DBConnectorPPG(
                db_name='tarrafaDB_2',
                db_host='10.0.0.249',
                db_port='5432',
                db_user='postgres',
                db_pass='postgres')
    yield db
    db.close()

#teste para get_user_db
def test_get_user_db(db_connection):
    user, avatar = crud.user.get_user_db(db_connection, email='rene.veloso@unimontes.br')
    assert user.email == 'rene.veloso@unimontes.br'
    assert avatar == 'https://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=K4759324E8'
    assert isinstance(user, UserInDB)

#teste válido para authenticate e get_user_db
def test_authenticate(db_connection):
    user, useravatar = crud.user.authenticate(db=db_connection, password='secret', email='rene.veloso@unimontes.br')     
    assert user.email == 'rene.veloso@unimontes.br'
    assert isinstance(user, UserInDB)
    assert useravatar == 'https://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=K4759324E8'

