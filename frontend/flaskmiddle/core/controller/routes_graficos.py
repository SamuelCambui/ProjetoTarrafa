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

controller_ppg_graficos = Blueprint('controller_ppg_graficos', __name__, url_prefix='/ppg/graficos')

@login_control.user_loader
def load_user(user_id):
    if 'user' in session:
        user = Usuario.getUsuario(user_id)
        return user

@login_control.unauthorized_handler
def unauthorized():
    logout_user()
    session.clear()
    return redirect(url_for('principal.controller_ppg_graficos.login_get'))

def processa_retorno(response):
    response = MessageToDict(response)
    retorno = {}
    for item in response['item']:
        retorno[item['nome']] = json.loads(item['json'])
    return retorno

@controller_ppg_graficos.get("<id_ppg>")
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

@controller_ppg_graficos.get("indicadores-tab/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def indicadores(anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc indicadores...')
    id_ppg = session['id_ppg']
    retorno = {}
    if stub:
        response = stub.ObtemIndicadores(messages_pb2.PpgRequest(id=id_ppg, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno

@controller_ppg_graficos.get("docentes-tab/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def docentes(anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc docentes...')
    id_ppg = session['id_ppg']
    retorno = {}
    if stub:
        response = stub.ObtemDocentes(messages_pb2.PpgRequest(id=id_ppg, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno

@controller_ppg_graficos.get("bancas-tab/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def bancas(anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc bancas...')
    id_ppg = session['id_ppg']
    retorno = {}
    if stub:
        response = stub.ObtemBancas(messages_pb2.PpgRequest(id=id_ppg, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno

@controller_ppg_graficos.get("egressos-tab/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def egressos(anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc egressos...')
    id_ppg = session['id_ppg']
    retorno = {}
    if stub:
        response = stub.ObtemEgressos(messages_pb2.PpgRequest(id=id_ppg, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno

@controller_ppg_graficos.get("projetos-tab/<anoi>/<anof>")
@Utils.ppg_stub()
@login_required
def projetos(anoi, anof, stub: PPGStub):
    print('Iniciando comunicacao com grpc projetos...')
    id_ppg = session['id_ppg']
    retorno = {}
    if stub:
        response = stub.ObtemProjetos(messages_pb2.PpgRequest(id=id_ppg, anoi=int(anoi), anof=int(anof)))
        print('ok')
        retorno = processa_retorno(response)
    return retorno