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
from protos.out import messages_pb2, usuarios_pb2_grpc, ppg_pb2_grpc
from protos.out.ppg_pb2_grpc import PPGStub, HomeStub
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

@controller_ppg.post("/login")
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
                session['user']['site'] = 'principal.controller_ppg.ppg'
                session['requestssession'] = requests.Session()

                return redirect(url_for('principal.controller_ppg.ppg'))
        
        #flash(json.loads(ret.content)['detail'], 'erro')
        return redirect(url_for('principal.controller_ppg.login_get'))

    except Exception as e:
        return render_template('ppg/erro.html')

@controller_ppg.get("/login")
def login_get():
    try:
        if 'user' in session:
            return redirect(url_for('principal.controller_ppg.ppg'))

        imagens = []
        path = os.path.dirname(os.path.realpath(__file__))
        for arquivo in os.listdir(path+'/../html/assets/img/usuarios'):
            imagens.append(arquivo)
        
        return render_template('ppg/login_ppg.html', imagens=imagens, dominios=None, login_link='/ppg/login')
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

@controller_ppg.get("graficos/indicadores-paralelo-tab/<id>/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def indicadores(id, anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc indicadores...')
    retorno = {}
    if stub:
        response = stub.ObtemIndicadores(messages_pb2.PpgRequest(id=id, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno

@controller_ppg.get("graficos/docentes-paralelo-tab/<id>/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def docentes(id, anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc docentes...')
    retorno = {}
    if stub:
        response = stub.ObtemDocentes(messages_pb2.PpgRequest(id=id, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno

@controller_ppg.get("graficos/bancas-paralelo-tab/<id>/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def bancas(id, anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc bancas...')
    retorno = {}
    if stub:
        response = stub.ObtemBancas(messages_pb2.PpgRequest(id=id, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno

@controller_ppg.get("graficos/egressos-paralelo-tab/<id>/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def egressos(id, anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc egressos...')
    retorno = {}
    if stub:
        response = stub.ObtemEgressos(messages_pb2.PpgRequest(id=id, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno

@controller_ppg.get("graficos/projetos-paralelo-tab/<id>/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def projetos(id, anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc projetos...')
    retorno = {}
    if stub:
        response = stub.ObtemProjetos(messages_pb2.PpgRequest(id=id, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno