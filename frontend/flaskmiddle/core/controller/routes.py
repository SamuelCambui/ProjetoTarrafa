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
                   redirect, render_template, request, send_file, stream_with_context, session, abort, render_template_string)

from flask.helpers import url_for
from flask_login import LoginManager, utils, login_user, logout_user, login_required, current_user
from werkzeug.exceptions import HTTPException

#from core import login_control
from frontend.flaskmiddle.core.models.User import Usuario

from frontend.flaskmiddle.config import config

import hashlib
import time

controller_principal = Blueprint('principal', __name__)

@controller_principal.app_template_filter()
def hash_url(url):
    m = hashlib.sha256()
    m.update(str(time.time()).encode("utf-8"))
    return f'{url}?v={m.hexdigest()}'

@controller_principal.route("/")
def root(pagina=None):
    pass