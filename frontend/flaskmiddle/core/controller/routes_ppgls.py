import json
import requests

from flask import (Blueprint, flash,redirect, render_template, request, session)

from flask.helpers import url_for
from flask_login import login_user, login_required, current_user
from core.models.User import Usuario
from core.utils import Utils

from config import config
# Mesmo não usando é necessário
import core.controller.login


controller_ppgls = Blueprint('controller_ppgls', __name__, url_prefix='/ppgls')

@controller_ppgls.post("/login")
def login_post():
    return render_template('index.html')
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
    return render_template('index.html')
    try:
        if 'user' in session:
            return redirect(url_for('principal.controller_ppgls.home'))

        ret = requests.get(f"{config.FASTAPI_URL}{config.API_STR}/ppg/geral/dominioscadastrados")
        if ret.status_code == 200:
            return render_template('ppgls/login.html', dominios=json.loads(ret.content), login_link='/ppgls/login')
    except Exception as error:
        return render_template('ppgls/erro.html')

@controller_ppgls.get("/home")
@login_required
def home():
    try:
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/ppg/geral/lista")
        if ret.status_code == 200:
            listaRanking = ret.json()['ranking']
            listaProgramas = ret.json()['programas']
            nome = listaProgramas[0]['nome_ies']
            avatar = session['user']['avatar']
            user = current_user
            return render_template('ppgls/home.html', avatar = avatar, listaProgramas = listaProgramas, nome = nome, listaRanking=listaRanking)
        return ret.json()['detail'], 400
    except Exception as error:
        return render_template('ppgls/erro.html')



