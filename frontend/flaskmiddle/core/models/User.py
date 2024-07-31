from flask_login import UserMixin
from flask import jsonify
import requests
from requests import ConnectionError
from frontend.flaskmiddle.config import config
from flask import abort

from protos.out import ppg_pb2, ppg_pb2_grpc, messages_pb2, usuarios_pb2_grpc
from google.protobuf.json_format import MessageToDict

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
                    response = stub.ObtemUsuario (messages_pb2.UsuarioRequest(username=id))
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