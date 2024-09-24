import json
import requests
import os
from flask import (Blueprint, redirect, render_template, request, session)
from flask.helpers import url_for
from flask_login import login_user, logout_user, login_required
from google.protobuf.json_format import MessageToDict
import grpc
import sys
from pathlib import Path

# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))
from frontend.flaskmiddle.core.models.User import Usuario
from frontend.flaskmiddle.core import login_control
from frontend.flaskmiddle.config import config
from protos.out import messages_pb2, usuarios_pb2_grpc
from protos.out.ppg_pb2_grpc import HomeStub, PPGStub
from frontend.flaskmiddle.core.utils import Utils

controller_ppg = Blueprint('controller_ppg', __name__, url_prefix='/ppg')

@login_control.user_loader
def load_user(user_id):
    if 'user' in session:
        user = Usuario.getUsuario(user_id)
        return user

@login_control.unauthorized_handler
def unauthorized():
    logout_user()
    session.clear()
    return redirect(url_for('principal.controller_ppg.login_get'))

@controller_ppg.get("/")
@login_required
def index():
    imagens = []
    path = os.path.dirname(os.path.realpath(__file__))
    for arquivo in os.listdir(path+'/../html/assets/img/usuarios'):
        imagens.append(arquivo)
    
    return render_template("index.html", imagens = imagens, login_link='/ppg/login')

@controller_ppg.get("/usuarios")
def usuarios():
    return "Usuarios"

@controller_ppg.get("/rede_colaboracao")
def rede_colaboracao():
    return "Rede colaboracao"

@controller_ppg.get("/ranking_docentes")
def ranking_docentes():
    return "ranking_docentes"

@controller_ppg.get("/artigos_docentes")
def artigos_docentes():
    return "artigos_docentes"

@controller_ppg.get("/setup")
def setup():
    return "setup"

@controller_ppg.post("/login")
# @Utils.home_stub()
def login_post():
    try:
        email = request.form.get("username").strip()
        passw = request.form.get("password").strip()

        response = None
        with grpc.insecure_channel(config.GRPC_SERVER_HOST) as channel:
            stub = usuarios_pb2_grpc.UsuarioStub(channel)
            if stub:
                response = stub.Login(messages_pb2.LoginRequest(username=email, password=passw))
        
        if response and not response.erro:
            user = Usuario.getUsuario(response.email)
            
            if user:
                login_user(user)
                session['user'] = MessageToDict(response)
                session['user']['id_ies'] = user.id_ies
                session['user']['site'] = 'principal.controller_ppg.ppg'
                session['requestssession'] = requests.Session()

                return redirect(url_for('principal.controller_ppg.home'))
        
        #flash(json.loads(ret.content)['detail'], 'erro')
        return redirect(url_for('principal.controller_ppg.login_get'))

    except Exception as e:
        return render_template('ppg/erro.html')

@controller_ppg.get("/login")
def login_get():
    try:
        return render_template('ppg/login_ppg.html')
    except Exception as error:
        print(error)
        return render_template('ppg/erro.html', erro=error, url=config.FASTAPI_URL)
    
@controller_ppg.get("/logout")
@login_required
def logout():
    try:
        logout_user()
        session.clear()
        return redirect(url_for('principal.controller_ppg.login_get'))
    except:
        return render_template('ppg/erro.html')

def processa_retorno(response):
    response = MessageToDict(response)
    retorno = {}
    for item in response['item']:
        retorno[item['nome']] = json.loads(item['json'])
    return retorno

@controller_ppg.get("/ppg")
@login_required
def ppg():
    return render_template("ppg/ppg.html")

@controller_ppg.get("/home")
@login_required
@Utils.home_stub()
def home(stub : HomeStub):
    try:
        if stub:
            response = stub.ObtemHome(messages_pb2.PpgRequest(id=session['user']['id_ies']))
            print('Home ok')
            retorno = processa_retorno(response)
            avatar = session['user']['avatar']
            listaProgramas = retorno['listaprogramas']
            nome = retorno['listaprogramas'][0]['nome_ies']
            # print("A")
            # return "HOME"
            return render_template('ppg/home.html', avatar = avatar, listaProgramas = listaProgramas, nome = nome)
        # return ret.json()['detail'], 400
    except Exception as error:
        print(error)
        return render_template('ppg/erro.html')

@controller_ppg.get("<id_ppg>")
@Utils.ppg_stub()
@login_required
def ppgs(stub : PPGStub, id_ppg=None):
    try:
        retorno = {}
        if stub:
            response = stub.ObtemInformacaoPPG(messages_pb2.PpgRequest(id=id_ppg))
            print('ok')
        retorno = processa_retorno(response)
        avatar = session['user']['avatar']
        session['id_ppg'] = id_ppg
        session['nota_ppg'] = retorno['informacao_ppg']['nota']
        return render_template('ppg/ppg.html', avatar = avatar, **(retorno['informacao_ppg']))
    except Exception as e:
        return render_template('ppg/erro.html')