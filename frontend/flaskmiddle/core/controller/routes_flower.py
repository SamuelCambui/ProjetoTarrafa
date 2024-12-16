import json
import requests

from flask import (Blueprint, flash, redirect, render_template, request, session)

from flask.helpers import url_for
from flask_login import login_user, logout_user, login_required, current_user

from core.models.User import Usuario
from core.utils import Utils

from config import config

controller_flower = Blueprint('controller_flower', __name__, url_prefix='/flower')
    
@controller_flower.get("/tasks")
def consultar_tasks():
    """
    Consultar todas as tarefas
    """
    try:
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/flower/tasks")
        if ret.status_code == 200:
            return ret.json()
    except:
        return render_template('ppg/erro.html')
    
@controller_flower.get("/consultar_progresso_tarefas/<nome_tarefa>")
def consultar_progresso(nome_tarefa : str):
    """
    Endpoint responsável as tarefas pendentes de um task

    Data:
        nome_tarefa: Nome da tarefa que será consultado o processo
    """
    try:
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/flower/tasks_pendentes/{nome_tarefa}")
        if ret.status_code == 200:
            return ret.json()
    except:
        return render_template('ppg/erro.html')
    pass
    
@controller_flower.get("/workers")
def consultar_workers():
    """
    Endpoint responsável por consultar os workers ativos

    Argumentos:
        nome_worker: Nome do worker que será desligado
    """
    try:
        ret = Utils.acessa_endpoint(f"{config.FASTAPI_URL}{config.API_STR}/flower/workers")
        if ret.status_code == 200:
            return ret.json()
    except:
        return render_template('ppg/erro.html')
    
@controller_flower.post("/worker/desligar/<nome_worker>")
def desligar_worker(nome_worker: str):
    """
    Endpoint responsável por desligar um worker

    Argumentos:
        nome_worker: Nome do worker que será desligado
    """
    try:
        ret = Utils.acessa_endpoint_post(f"{config.FASTAPI_URL}{config.API_STR}/flower/worker/desligar/{nome_worker}")
        if ret.status_code == 200:
            return f"Worker {nome_worker} desligado"
    except:
        return render_template('ppg/erro.html')
    
@controller_flower.post("/worker/reiniciar/<nome_worker>")
def reiniciar_worker(nome_worker: str):
    """
    Endpoint responsável por reiniciar um worker

    Argumentos:
        nome_worker: Nome do worker que será reiniciado
    """
    try:
        ret = Utils.acessa_endpoint_post(f"{config.FASTAPI_URL}{config.API_STR}/flower/worker/reiniciar/{nome_worker}")
        if ret.status_code == 200:
            return f"Worker {nome_worker} reiniciado"
    except:
        return render_template('ppg/erro.html')
    

