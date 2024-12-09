import requests
from flask import session
from protos.out.ppgls_pb2_grpc import IndicadoresPosGraduacaoLSStub, DadosPosGraduacaoLSStub, DadosFormularioPosGraduacaoLSStub
from config import config
from functools import wraps, update_wrapper
import grpc


class Utils:
    @staticmethod
    def acessa_endpoint(caminho):
        reqsession = session['requestssession']
        ret = reqsession.get(caminho, headers = {
                'accept': 'application/json',
                'Authorization': f"Bearer {session['user']['access_token']}"
            })
        ret.raw.chunked = True
        return ret
        # if ret.status_code == 200:
            # return ret.json()
        # return None

    @staticmethod
    def acessa_endpoint_delete(caminho):
        reqsession = session['requestssession']
        ret = reqsession.delete(caminho, headers = {
                'accept': 'application/json',
                'Authorization': f"Bearer {session['user']['access_token']}"
            })
        ret.raw.chunked = True
        if ret.status_code == 200:
            return ret.json()
        return None

    @staticmethod
    def acessa_endpoint_post(caminho, chave, valor):
        reqsession = session['requestssession']
        ret = reqsession.post(caminho, 
            json = {
                chave: valor
            }, 
            headers = {
                'accept': 'application/json',
                'Authorization': f"Bearer {session['user']['access_token']}"
            }
        )
        ret.raw.chunked = True
        if ret.status_code == 200:
            return ret.json()
        return None

    @staticmethod
    def grpc_stub(stub, url):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                try: 
                    channel = grpc.insecure_channel(url)
                    _stub = stub(channel)
                    kwargs['stub'] = _stub
                    return func(*args, **kwargs)
                except Exception as error:
                    print(f'Erro ao conectar com stub {stub}')
                    print(f'Erro: {error}')
                    raise error
            return wrapper
        return decorator
    
    @staticmethod
    def dados_ppgls_stub(*args):
        return Utils.grpc_stub(stub=DadosPosGraduacaoLSStub, url=config.GRPC_SERVER_PPGLS)
    
    @staticmethod
    def indicadores_ppgls_stub(*args):
        return Utils.grpc_stub(stub=IndicadoresPosGraduacaoLSStub, url=config.GRPC_SERVER_PPGLS)
    
    @staticmethod
    def dados_formulario_ppgls_stub(*args):
        return Utils.grpc_stub(stub=DadosFormularioPosGraduacaoLSStub, url=config.GRPC_SERVER_PPGLS)

    