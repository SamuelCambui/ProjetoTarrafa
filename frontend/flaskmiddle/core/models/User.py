from flask_login import UserMixin
from flask import jsonify
import requests
from requests import ConnectionError
from config import Config
from flask import abort

class Usuario(UserMixin):
    def __init__(self, idlattes, email, full_name, is_superuser, is_admin, id_ies):
        self.idlattes = idlattes
        self.email = email
        self.full_name = full_name
        self.is_superuser = is_superuser
        self.is_admin = is_admin
        self.id_ies = id_ies
        
    @staticmethod
    def getUsuario(id, token):
        try:
            ret = requests.get(f"{Config.FASTAPI_URL}{Config.API_STR}/users/{id}", headers = {
                'accept': 'application/json',
                'Authorization': f'Bearer {token}'
            }).json()
            user = Usuario(ret['idlattes'], ret['email'], ret['full_name'], ret['is_superuser'], ret['is_admin'], ret['id_ies'])
            return user
        except Exception as e:
            return None
    
    def getJson(self):
        dic = {'id' : self.id}
        return jsonify(dic)

    def get_id(self):
        return self.idlattes