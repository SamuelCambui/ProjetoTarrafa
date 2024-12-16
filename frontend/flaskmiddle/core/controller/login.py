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

import bcrypt
import flask
from flask_session import Session

from flask import (Blueprint, Flask, current_app, flash, jsonify, make_response,
                   redirect, render_template, request, send_file, stream_with_context, session, abort)

from flask.helpers import url_for
from flask_login import LoginManager, utils, login_user, logout_user, login_required, current_user
from werkzeug.exceptions import HTTPException

from core import login_control
from core.models.User import Usuario
from core.controller.routes import controller_principal


@login_control.user_loader
def load_user(user_id):
    if 'user' in session and 'access_token' in session['user']:
        user = Usuario.getUsuario(user_id, session['user']['access_token'])
        return user

@login_control.unauthorized_handler
def unauthorized():
    logout_user()
    session.clear()
    return redirect(url_for('principal.controller_ppg.login_get'))