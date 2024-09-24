import time
import os
from flask import (Blueprint, redirect, render_template, request, session)
from flask.helpers import url_for
import hashlib

controller_principal = Blueprint('principal', __name__)

@controller_principal.app_template_filter()
def hash_url(url):
    m = hashlib.sha256()
    m.update(str(time.time()).encode("utf-8"))
    return f'{url}?v={m.hexdigest()}'

@controller_principal.route("/")
@controller_principal.route("/<pagina>")
def root(pagina=None):
    try:
        imagens = []
        path = os.path.dirname(os.path.realpath(__file__))
        for arquivo in os.listdir(path+'/../html/assets/img/usuarios'):
            imagens.append(arquivo)
        if pagina and 'user' not in session:
            return render_template("index.html", imagens=imagens)
        if 'user' in session:
            if 'site' in session['user']:
                return redirect(url_for(session['user']['site']))
        return render_template("index.html", imagens=imagens)
    except Exception as error:
        return render_template('ppg/erro.html')

@controller_principal.route("/paginadeconfirmacao")
def pagina_de_confirmacao():
    return render_template("ppg/confirmationpage.html")

# @controller_principal.post("/senhaesquecida")
# def senha_esquecida():
#     try:
#         password = request.form.get("password")
#         token = request.form.get("token")
        
#         ret = requests.post(f"{config.FASTAPI_URL}{config.API_STR}/finish-reset-password/", data={
#             'password': password,
#             'token': token
#             }, 
#             headers = { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
#         )

#         if ret.status_code == 200:
#             return {'redirect': '/paginadeconfirmacao'}
#     except Exception as error:
#         return render_template('ppg/erro.html')

@controller_principal.get("/recuperarsenha")
def recuperar_senha():
    try:
        token = request.args.get('access_token')
        return render_template("ppg/forgotpassword.html")
    except Exception as error:
        return render_template('ppg/erro.html')

    
@controller_principal.route("/equipe")
def sobre(pagina=None):
    try:
        return render_template("ppg/equipe.html")
    except Exception as error:
        return render_template('ppg/erro.html')

@controller_principal.route("/aula/autentica", methods=["POST"])
def aula_autentica():
    try:
        content_type = request.headers.get('Content-Type')
        
        if ('application/json' in content_type):
            user = request.json
            if user:
                if 'username' in user and 'password' in user:
                    if user['username'] == 'si@unimontes.br':
                        if user['password'] == '123':
                            return {'resposta': 'ok', 'motivo': 'usuario e senha corretos'}
                        return {'resposta': 'erro', 'motivo': 'senha incorreta'}
                    return {'resposta': 'erro', 'motivo': 'usuario incorreto'}
                return {'resposta': 'erro', 'motivo': 'campos de requisicao faltantes'}
        return {'resposta': 'erro', 'motivo': 'formato de requisicao incorreto'}
    except Exception as e:
        return {'resposta': 'falha', 'motivo': str(e)}