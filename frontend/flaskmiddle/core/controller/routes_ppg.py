import json
import requests
import os

import time

from flask import (Blueprint, flash, redirect, render_template, request, session)

from flask.helpers import url_for
from flask_login import login_user, logout_user, login_required, current_user

from core.models.User import Usuario
from core.utils import Utils

from config import config

import sys
from pathlib import Path

# Adiciona o diretório raiz do projeto ao sys.path
diretorio_raiz = Path(__name__).resolve().parent
sys.path.append(str(diretorio_raiz))

from proto.out import ppg_pb2, ppg_pb2_grpc, messages_pb2

import grpc
from google.protobuf.json_format import ParseDict, MessageToJson

controller_ppg = Blueprint('controller_ppg', __name__, url_prefix='/ppg')

@controller_ppg.get("/indicadores/<id>/<anoi>/<anof>")
def indicadores(id, anoi, anof):
    with grpc.insecure_channel('localhost:50052') as channel:
            stub = ppg_pb2_grpc.IndicadoresStub(channel)
            if stub:
                response = stub.ObtemIndicadores(messages_pb2.PpgRequest(id=id, anoi=int(anoi), anof=int(anof)))
                print(response)
    return render_template("ppg/ppg.html")
