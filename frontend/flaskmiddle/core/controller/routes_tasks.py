import json
import requests

from flask import (Blueprint, flash, redirect, render_template, request, session)

from flask.helpers import url_for
from flask_login import login_user, logout_user, login_required, current_user

from core.models.User import Usuario
from core.utils import Utils

from config import config

controller_tasks = Blueprint('controller_tasks', __name__, url_prefix='/tasks')


@controller_tasks.get("/")
def renderizar_pagina():
    """
    Endpoint responsável por renderizar a págia das tarefas
    """
    return render_template('tasks/teste.html')

@controller_tasks.get("/processar_curriculos/<id_ies>")
def processar_curriculos(id_ies):
    """
    Endpoint responsável por processar os curriculos no banco de dados

    Parâmetros:
        id_ies : Id da universidade que será processado os currículos
    """
    try:
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/tarefas/processar_curriculos/{id_ies}")
        if ret.status_code == 200:
            #data = ret.json()
            return {'quantidade': ret.json()}
    except:
        return render_template('ppg/erro.html')
    
@controller_tasks.get("/baixar_curriculos/<id_ies>")
def baixar_curriculos(id_ies):
    """
    Endpoint responsável por baixar os curriculos no banco de dados

    Parâmetros:
        id_ies : Id da universidade que será baixado os currículos
    """
    try:
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/tarefas/baixar_curriculos/{id_ies}")
        if ret.status_code == 200:
            return {'quantidade': ret.json()}
    except:
        return render_template('ppg/erro.html')

@controller_tasks.post("/consultar_tasks/")
def consultar_task():
    """
    Endpoint responsável por consultar os ids de uma lista

    Data:
        ids: Lista dos ids das tarefas
    """
    try:
        ids = request.json["ids"]
        responses = []
        for id_task in ids:
            ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/tarefas/consultar_task/{id_task}")
            if ret.status_code == 200:
                data = ret.json()
                responses.append(data)
        return responses
    except:
        return render_template('ppg/erro.html')
    
@controller_tasks.get("/consultar_progresso/<tarefa>/<id_ies>")
def consultar_progresso(tarefa, id_ies):
    """
    Endpoint responsável por consultar os ids de uma lista

    Data:
        ids: Lista dos ids das tarefas
    """
    try:
        responses = {}
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/tarefas/consultar_progresso/{tarefa}/{id_ies}")
        if ret.status_code == 200:
            data = ret.json()
            return data
        return responses
    except:
        return render_template('ppg/erro.html')


@controller_tasks.get("/limpar_cache/<id_ies>")
def limpar_cache(id_ies):
    """
    Endpoint responsável por limpar o cache de uma determinada IES

    Parâmetros:
        id_ies : Id da universidade alvo
    """
    try:
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/tarefas/limpar_cache/{id_ies}")
        if ret.status_code == 200:
            return {'quantidade': ret.json()}
    except:
        return render_template('ppg/erro.html')
    
@controller_tasks.get("/lista_programas/<id_ies>")
def lista_programas(id_ies):
    """
    Endpoint responsável por retornar a lista de ppgs de uma instituição

    Parâmetros:
        id_ies : Id da universidade alvo
    """
    try:
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/tarefas/lista_programas/{id_ies}")
        if ret.status_code == 200:
            return ret.json()
    except:
        return render_template('ppg/erro.html')