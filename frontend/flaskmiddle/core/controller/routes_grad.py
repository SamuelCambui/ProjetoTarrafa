import json
import logging
from threading import Thread
import time
import traceback
from datetime import date, datetime
from urllib import response
from decimal import Decimal

import requests
import os

import io
import sys

import bcrypt
import flask
from flask_session import Session

from flask import (Blueprint, Flask, current_app, flash, jsonify, make_response,
                   redirect, render_template, request, send_file, stream_with_context, session, abort)

from flask.helpers import url_for
from flask_login import LoginManager, utils, login_user, logout_user, login_required, current_user
#from werkzeug.exceptions import HTTPException

from core import login_control
from core.models.User import Usuario
from core.utils import Utils

from config import config
import core.controller.login

import hashlib
import time

controller_grad = Blueprint('controller_grad', __name__, url_prefix='/grad')

@controller_grad.get("/home")
def home():
    return '<h1>home grad</h1>'

@controller_grad.post("/login")
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
            session['user']['site'] = 'principal.controller_grad.home'
            session['requestssession'] = requests.Session()

            return redirect(url_for('principal.controller_grad.home'))
        flash(json.loads(ret.content)['detail'], 'erro')
        return redirect(url_for('principal.controller_grad.login_get'))
    except:
        return render_template('grad/erro.html')

@controller_grad.get("/login")
def login_get():
    #return render_template('index.html')
    try:
        if 'user' in session:
            return redirect(url_for('principal.controller_grad.home'))

        ret = requests.get(f"{config.FASTAPI_URL}{config.API_STR}/ppg/geral/dominioscadastrados")
        if ret.status_code == 200:
            return render_template('grad/login.html', dominios=json.loads(ret.content), login_link='/grad/login')
    except Exception as error:
        return render_template('grad/erro.html')


@controller_grad.get("/verifica/pendencia/<cpf>/<tipo>")
def verifica_formulario(cpf=None, tipo=None):
    #return jsonify({'retorno':0})
    
    if tipo.lower() == 'aluno' or tipo.lower() == 'professor':
        ret = requests.post(f"{config.FASTAPI_URL}{config.API_STR}/grad/verifica/pendencia/{cpf}")
        if ret.status_code == 200:
            return jsonify({'retorno':ret.json()})
    return jsonify({'retorno':0})

@controller_grad.get("/pendencia/<cpf>/<tipo>")
def pendencia_get(cpf=None, tipo=None):
    print(f'Redirecionando para formulario [{cpf}: {tipo}]')
    #if tipo.lower() == 'aluno':
    #if tipo.lower() == 'professor':
    return render_template("grad/formulario.html", formulario_post = '/grad/formulario', cpf=cpf, tipo=tipo, obrigar='nao')
    #return render_template("grad/formulario.html", formulario_post = '/grad/formulario', cpf=cpf, tipo=tipo, obrigar='sim')

@controller_grad.post("/finaliza/pendencia/docente")
def finaliza_pendencia_docente_post():
    try:
        # Dados Formulário
        
        nome = '--'
        nomeSocial = '--'
        cpf = request.form.get("cpf").replace(".","").replace("-","")
        rg = '--'+cpf
        email = '--@'+cpf
        cep = '--'
        cidade = '--'
        estado = '--'
        logradouro = '--'
        numCasa = 0
        bairro = '--'
        contato = '--'
        estadoCivil = '--'
        genero = '--'
        generoInput = '--'
        genero_identifica = '--'
        etnia = '--'
        etniaInput = '--'
        pronomes = '--'
        necessidadeEspecial = '--'
        necessidadeEspecialInput = '--'
        contatoMedico = '--'
        contatoFamiliar = '--'
        complementoCasa = '--'
        matricula = '--'

        tipo = request.form.get("tipo")
        
        dados  = {'nome' : nome, 'nome_social' : nomeSocial, 'cpf' : cpf,
                  'rg' : rg,'email' : email, 'cep' : cep, 'cidade' : cidade, 
                  'estado' : estado, 'logradouro' : logradouro, 'num_casa' : numCasa, 
                  'bairro' : bairro, 'contato_pessoal' : contato,'estado_civil' : estadoCivil, 
                  'genero' : genero, 'generoInput' : generoInput, 'pronomes' : pronomes, 
                  'etnia' : etnia, 'etniaInput' : etniaInput, 'possui_necessidade' : necessidadeEspecial, 
                  'necessidade' : necessidadeEspecialInput, 'contato_medico' : contatoMedico, 
                  'contato_familiar' : contatoFamiliar, 'genero_identifica': genero_identifica,
                  'complemento_casa': complementoCasa, 'matricula': matricula
        }        
        
        # Redirecinamento FastAPI
        
        ret = requests.post(f"{config.FASTAPI_URL}{config.API_STR}/grad/formulario", data = dados)

        # if ret.status_code == 200:
        #     data = ret.json()
        #     if "retorno" in data:
        #         if data["retorno"] == "ok":
        return redirect(f'http://www.webgiz.unimontes.br/index.php?option=com_aix{tipo}')
        #         else:
        #             flash(json.loads(ret.content)['detail'], 'erro')
        # return redirect(url_for('principal.controller_ppg.login_get'))
    except Exception as error:
        return render_template('grad/erro.html')

@controller_grad.post("/formulario")
def formulario_post():
    try:
        # Dados Formulário
        
        nome = request.form.get("nome")
        nomeSocial = request.form.get("nomeSocial")
        cpf = request.form.get("cpf").replace(".","").replace("-","")
        rg = request.form.get("rg").replace(".","").replace("-","")
        email = request.form.get("email")
        cep = request.form.get("cep").replace("-","")
        cidade = request.form.get("cidade")
        estado = request.form.get("estado")
        logradouro = request.form.get("logradouro")
        numCasa = request.form.get("numCasa")
        bairro = request.form.get("bairro")
        contato = request.form.get("contato").replace("(","").replace(")", "").replace("-", "")
        estadoCivil = request.form.get("estadoCivil")
        genero = request.form.get("genero")
        generoInput = request.form.get("generoInput")
        genero_identifica = request.form.get("generoIdentifica")
        etnia = request.form.get("etnia")
        etniaInput = request.form.get("etniaInput")
        pronomes = request.form.get("pronomes")
        necessidadeEspecial = request.form.get("necessidadeEspecial")
        necessidadeEspecialInput = request.form.get("necessidadeEspecialInput")
        contatoMedico = request.form.get("contatoMedico").replace("(","").replace(")", "").replace("-", "")
        contatoFamiliar = request.form.get("contatoFamiliar").replace("(","").replace(")", "").replace("-", "")
        complementoCasa = request.form.get("complementoCasa")
        matricula = request.form.get("matricula")

        tipo = request.form.get("tipo")
        
        dados  = {'nome' : nome, 'nome_social' : nomeSocial, 'cpf' : cpf,
                  'rg' : rg,'email' : email, 'cep' : cep, 'cidade' : cidade, 
                  'estado' : estado, 'logradouro' : logradouro, 'num_casa' : numCasa, 
                  'bairro' : bairro, 'contato_pessoal' : contato,'estado_civil' : estadoCivil, 
                  'genero' : genero, 'generoInput' : generoInput, 'pronomes' : pronomes, 
                  'etnia' : etnia, 'etniaInput' : etniaInput, 'possui_necessidade' : necessidadeEspecial, 
                  'necessidade' : necessidadeEspecialInput, 'contato_medico' : contatoMedico, 
                  'contato_familiar' : contatoFamiliar, 'genero_identifica': genero_identifica,
                  'complemento_casa': complementoCasa, 'matricula': matricula
        }        
        
        # Redirecinamento FastAPI
        
        ret = requests.post(f"{config.FASTAPI_URL}{config.API_STR}/grad/formulario", data = dados)

        # if ret.status_code == 200:
        #     data = ret.json()
        #     if "retorno" in data:
        #         if data["retorno"] == "ok":
        return redirect(f'http://www.webgiz.unimontes.br/index.php?option=com_aix{tipo}')
        #         else:
        #             flash(json.loads(ret.content)['detail'], 'erro')
        # return redirect(url_for('principal.controller_ppg.login_get'))
    except Exception as error:
        return render_template('grad/erro.html')



