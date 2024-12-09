from http.client import HTTPException
import json
import requests

from flask import (Blueprint, flash,redirect, render_template, request, session)
from flask.helpers import url_for
from flask_login import login_user
from frontend.flaskmiddle.core.models.User import Usuario
from frontend.flaskmiddle.core.utils import Utils
from frontend.flaskmiddle.config import config

from protos.out.ppgls_pb2_grpc import DadosPosGraduacaoLSStub
from protos.out.messages_pb2 import PPGLSRequest
from google.protobuf.json_format import MessageToDict


controller_ppgls = Blueprint('controller_ppgls', __name__, url_prefix='/ppgls')

@controller_ppgls.post("/login")
def login_post():
    #return render_template('index.html')
    try:
        uname = request.form.get("username")
        email = uname+request.form.get("selectUniversidade")
        passw = request.form.get("password")

        ret = requests.post(f"{config.FASTAPI_URL}{config.API_STR}/login/access-token", data={"username":email, "password":passw})
        if ret.status_code == 200:
            data = ret.json()
            user = Usuario.getUsuario(data['idlattes'], data['access_token'])
            login_user(user)

            session['user'] = data
            session['user']['site'] = 'principal.controller_ppgls.home'
            session['requestssession'] = requests.Session()

            return redirect(url_for('principal.controller_ppgls.home'))
        flash(json.loads(ret.content)['detail'], 'erro')
        return redirect(url_for('principal.controller_ppgls.login_get'))
    except:
        return render_template('ppgls/erro.html')

@controller_ppgls.get("/login")
def login_get():
    #return render_template('index.html')
    try:
        if 'user' in session:
            return redirect(url_for('principal.controller_ppgls.home'))

        ret = requests.get(f"{config.FASTAPI_URL}{config.API_STR}/ppg/geral/dominioscadastrados")
        if ret.status_code == 200:
            return render_template('ppgls/login.html', dominios=json.loads(ret.content), login_link='/ppgls/login')
    except Exception as error:
        return render_template('ppgls/erro.html')

@controller_ppgls.get("/home")
@Utils.dados_ppgls_stub()
#@login_required
def home(stub: DadosPosGraduacaoLSStub):
    try:

        # avatar = session['user']['avatar']
        # user = current_user
        response = stub.GetCursos(PPGLSRequest())
        response = MessageToDict(response)
        cursos = json.loads(response['item'][0]['json']) #Se for usar aquilo de .id ou algo assim
        # transforma esse cursos em umas lista de dicionários e não lista de listas.
        return render_template("ppgls/home.html", cursos=cursos, nome='Universidade Estadual de Montes Claros')
    except Exception as err:
        print(err)
        return render_template('ppg/erro.html')
    
@controller_ppgls.get("/curso/<id>")
# @Utils.dados_ppgls_stub()
#@login_required
def curso(id):
    try:
        return id
    except Exception as err:
        print(err)
        return render_template('ppg/erro.html')
