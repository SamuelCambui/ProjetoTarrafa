# import sys
# import os

from flask_login import UserMixin
from flask import jsonify
from config import config

# # Adiciona o diretório raiz do projeto ao sys.path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from protos.out import messages_pb2, usuarios_pb2_grpc

import grpc

class Usuario(UserMixin):
    def __init__(self, idlattes, email, full_name, is_superuser, is_admin, id_ies):
        self.idlattes = idlattes
        self.email = email
        self.full_name = full_name
        self.is_superuser = is_superuser
        self.is_admin = is_admin
        self.id_ies = id_ies
        
    @staticmethod
    def getUsuario(id):
        try:
            with grpc.insecure_channel(config.GRPC_SERVER_HOST) as channel:
                stub = usuarios_pb2_grpc.UsuarioStub(channel)
                user = None
                if stub:
                    response = stub.ObtemUsuario(messages_pb2.UsuarioRequest(username=id))
                    print('ok')
                    user = Usuario(response.idlattes, response.email, response.full_name, response.is_superuser, response.is_admin, response.id_ies)
            return user
        except Exception as e:
            return None
    
    def getJson(self):
        dic = {'id' : self.id}
        return jsonify(dic)

    def get_id(self):
        return self.idlattes