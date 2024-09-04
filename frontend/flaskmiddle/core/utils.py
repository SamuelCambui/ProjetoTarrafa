from flask import session
from config import config
from frontend.flaskmiddle.config import config
from functools import wraps
import grpc
from protos.out.ppg_pb2_grpc import HomeStub, PPGStub

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
    
    # @staticmethod
    # def dados_grad_stub(*args):
    #     return Utils.grpc_stub(stub=DadosGraduacaoStub, url=config.GRPC_SERVER_GRAD)

    # @staticmethod
    # def indicadores_grad_stub(*args):
    #     return Utils.grpc_stub(stub=IndicadoresGraduacaoStub, url=config.GRPC_SERVER_GRAD)
    
    def home_stub(*args):
        return Utils.grpc_stub(stub=HomeStub, url=config.GRPC_SERVER_HOST)
    
    def ppg_stub(*args):
        return Utils.grpc_stub(stub=PPGStub, url=config.GRPC_SERVER_HOST)
