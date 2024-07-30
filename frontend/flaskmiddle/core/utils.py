import requests
from flask import session
from frontend.flaskmiddle.config import config

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
